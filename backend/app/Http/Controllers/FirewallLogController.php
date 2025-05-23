<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WinFirewallLog;

class FirewallLogController extends Controller
{
    public function index(Request $request, $device_id = null)
    {
        $user = $request->user();
        $paginate = $request->query('paginate', 10);

        $firewallLogs = WinFirewallLog::with(['device:id,name', 'source_ip:id,address,is_local,is_blocked,is_tor_exit_node,is_vpn,is_datacenter,geo_location_id', 'source_ip.geo_location:id,country_name,country_code'])
            ->when($device_id, function ($query) use ($device_id) {
                $query->where('device_id', $device_id);
            }, function ($query) use ($user) {
                if ($user->cannot('viewAny', \App\Models\Device::class)) {
                    $query->whereIn('device_id', $user->devices()->pluck('devices.id'));
                }
            })
            ->orderBy('captured_at', $request->query('order', 'asc'))
            ->paginate($paginate)->toArray();

        return response()->json($firewallLogs);
    }

    public function per_device($id, Request $request)
    {
        if ($request->user()->cannot('viewAny', \App\Models\Device::class)) {
            $request->user()->devices()->where('devices.id', $id)->firstOrFail();
            if ($request->user()->cannot('view', \App\Models\Device::class)) {
                abort(403, 'You cannot view this device');
            }
        }
        return $this->index($request, $id);
    }
}
