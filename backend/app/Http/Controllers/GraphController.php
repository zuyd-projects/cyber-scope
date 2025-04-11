<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GraphController extends Controller
{
    public function countries_by_connections(Request $request)
    {
        if ($request->user()->is_admin) {
            $userDeviceIds = $request->query('device_id', null);
        } else {
            $userDeviceIds = $request->user()->devices->pluck('id');
            if ($request->query('device_id')) {
                $userDeviceIds = $request->user()->devices->where('id', $request->query('device_id'))->pluck('id');
            }
        }

        if ($userDeviceIds && !is_array($userDeviceIds)) {
            $userDeviceIds = [$userDeviceIds];
        }

        $inboundConnections = DB::table(function ($query) use ($userDeviceIds) {
            $query->select(
                'geo_locations.country_name',
                'geo_locations.country_code',
                DB::raw('COUNT(*) as total_connections')
            )
                ->from('ssh_requests')
                ->join('ip_addresses', 'ssh_requests.source_address_id', '=', 'ip_addresses.id')
                ->where('ip_addresses.is_local', false)
                ->when($userDeviceIds, function ($query) use ($userDeviceIds) {
                    return $query->whereIn('ssh_requests.device_id', $userDeviceIds);
                })
                ->leftJoin('geo_locations', 'ip_addresses.geo_location_id', '=', 'geo_locations.id')
                ->groupBy('geo_locations.country_name', 'geo_locations.country_code')
                ->union(
                    DB::table('win_firewall_logs')
                        ->select(
                            'geo_locations.country_name',
                            'geo_locations.country_code',
                            DB::raw('COUNT(*) as total_connections')
                        )
                        ->join('ip_addresses', 'win_firewall_logs.source_address_id', '=', 'ip_addresses.id')
                        ->where('ip_addresses.is_local', false)
                        ->when($userDeviceIds, function ($query) use ($userDeviceIds) {
                            return $query->whereIn('win_firewall_logs.device_id', $userDeviceIds);
                        })
                        ->leftJoin('geo_locations', 'ip_addresses.geo_location_id', '=', 'geo_locations.id')
                        ->groupBy('geo_locations.country_name', 'geo_locations.country_code')
                )
                ->union(
                    DB::table('packets')
                        ->select(
                            'geo_locations.country_name',
                            'geo_locations.country_code',
                            DB::raw('COUNT(*) as total_connections')
                        )
                        ->join('ip_addresses', 'packets.source_address_id', '=', 'ip_addresses.id')
                        ->where('ip_addresses.is_local', false)
                        ->when($userDeviceIds, function ($query) use ($userDeviceIds) {
                            return $query->whereIn('packets.device_id', $userDeviceIds);
                        })
                        ->leftJoin('geo_locations', 'ip_addresses.geo_location_id', '=', 'geo_locations.id')
                        ->groupBy('geo_locations.country_name', 'geo_locations.country_code')
                );
        }, 'inbound_subquery')
            ->select(
                'country_name',
                'country_code',
                DB::raw('SUM(total_connections) as total_connections')
            )
            ->groupBy('country_name', 'country_code')
            ->orderBy('total_connections', 'desc')
            ->get();

        $outboundConnections = DB::table('packets')
            ->select(
                'geo_locations.country_name',
                'geo_locations.country_code',
                DB::raw('COUNT(*) as total_connections')
            )
            ->join('ip_addresses', 'packets.destination_address_id', '=', 'ip_addresses.id')
            ->where('ip_addresses.is_local', false)
            ->when($userDeviceIds, function ($query) use ($userDeviceIds) {
                return $query->whereIn('packets.device_id', $userDeviceIds);
            })
            ->leftJoin('geo_locations', 'ip_addresses.geo_location_id', '=', 'geo_locations.id')
            ->groupBy('geo_locations.country_name', 'geo_locations.country_code')
            ->orderBy('total_connections', 'desc')
            ->get();

        return response()->json([
            'inbound' => $inboundConnections,
            'outbound' => $outboundConnections,
        ]);
    }

    public function connections_over_time(Request $request)
    {
        $userDeviceIds = $request->user()->is_admin ? null : $request->user()->devices->pluck('id');

        $firewallLogs = DB::table('win_firewall_logs')
            ->when($userDeviceIds, function ($query) use ($userDeviceIds) {
                return $query->whereIn('device_id', $userDeviceIds);
            })
            ->select(
                DB::raw("DATE_FORMAT(captured_at, '%Y-%m-%dT%H:00:00Z') as time"),
                DB::raw('COUNT(*) as total_connections')
            )
            ->groupBy('time')
            ->orderBy('time')
            ->pluck('total_connections', 'time');

        $sshLogs = DB::table('ssh_requests')
            ->when($userDeviceIds, function ($query) use ($userDeviceIds) {
                return $query->whereIn('device_id', $userDeviceIds);
            })
            ->select(
                DB::raw("DATE_FORMAT(captured_at, '%Y-%m-%dT%H:00:00Z') as time"),
                DB::raw('COUNT(*) as total_connections')
            )
            ->groupBy('time')
            ->orderBy('time')
            ->pluck('total_connections', 'time');

        $packets = DB::table('packets')
            ->when($userDeviceIds, function ($query) use ($userDeviceIds) {
                return $query->whereIn('device_id', $userDeviceIds);
            })
            ->select(
                DB::raw("DATE_FORMAT(captured_at, '%Y-%m-%dT%H:00:00Z') as time"),
                DB::raw('COUNT(*) as total_connections')
            )
            ->groupBy('time')
            ->orderBy('time')
            ->pluck('total_connections', 'time');

        return response()->json([
            'firewalllogs' => $firewallLogs,
            'sshlogs' => $sshLogs,
            'packets' => $packets,
        ]);
    }
}
