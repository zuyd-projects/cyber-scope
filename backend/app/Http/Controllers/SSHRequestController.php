<?php

namespace App\Http\Controllers;

use App\Models\SSHRequest;
use Illuminate\Http\Request;

class SSHRequestController extends Controller
{
    public function index(Request $request, $device_id = null)
    {
        $paginate = $request->query('paginate', 10);
        $firewallLogs = SSHRequest::with(['device:id,name', 'source_ip:id,address,geo_location_id', 'source_ip.geo_location:id,country_name,country_code'])
            ->when($device_id, function ($query) use ($device_id) {
                $query->where('device_id', $device_id);
            })
            ->whereHas('device', function ($query) use ($request) {
                if ($request->user()->cannot('viewAny', \App\Models\Device::class)) {
                    $query->whereIn('devices.id', $request->user()->devices()->pluck('devices.id'));
                }
            })
            ->orderBy('captured_at', $request->query('order', 'asc'))
            ->simplePaginate($paginate);
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
