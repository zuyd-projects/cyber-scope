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
            ->orderBy('captured_at', $request->query('order', 'asc'))
            ->simplePaginate($paginate);
        return response()->json($firewallLogs);
    }

    public function per_device($id, Request $request)
    {
        return $this->index($request, $id);
    }
}
