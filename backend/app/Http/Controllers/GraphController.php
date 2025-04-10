<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GraphController extends Controller
{
    public function countries_by_connections()
    {
        $inboundConnections = DB::table(function ($query) {
            $query->select(
                'geo_locations.country_name',
                'geo_locations.country_code',
                DB::raw('COUNT(*) as total_connections')
            )
                ->from('ssh_requests')
                ->join('ip_addresses', 'ssh_requests.source_address_id', '=', 'ip_addresses.id')
                ->where('ip_addresses.is_local', false)
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
                DB::raw('SUM(size) as total_connections')
            )
            ->join('ip_addresses', 'packets.destination_address_id', '=', 'ip_addresses.id')
            ->where('ip_addresses.is_local', false)
            ->leftJoin('geo_locations', 'ip_addresses.geo_location_id', '=', 'geo_locations.id')
            ->groupBy('geo_locations.country_name', 'geo_locations.country_code')
            ->orderBy('total_connections', 'desc')
            ->get();

        return response()->json([
            'inbound' => $inboundConnections,
            'outbound' => $outboundConnections,
        ]);
    }
}
