<?php

namespace App\Http\Controllers;

use App\Models\IPAddress;
use Illuminate\Http\Request;

class IPAddressController extends Controller
{
    public function index(Request $request)
    {
        $paginate = $request->query('paginate', 10);
        $ips = IPAddress::with(['geo_location'])
            ->simplePaginate($paginate);
        return response()->json($ips);
    }

    public function show($id)
    {
        $ips = IPAddress::with(['geo_location'])->findOrFail($id);
        return response()->json($ips);
    }

    public function search(Request $request)
    {
        $paginate = $request->query('paginate', 10);
        $query = $request->query('query', null);
        if (is_null($query)) {
            return response()->json(['message' => 'Query parameter is required'], 400);
        }
        $ips = IPAddress::with(['geo_location'])
            ->where('address', 'LIKE', "%{$query}%")
            ->simplePaginate($paginate);

        return response()->json($ips);
    }

    public function by_country()
    {
        $ips = IPAddress::selectRaw('geo_locations.country_name, geo_locations.country_code, COUNT(ip_addresses.id) as count')
            ->join('geo_locations', 'ip_addresses.geo_location_id', '=', 'geo_locations.id')
            ->groupBy('geo_locations.country_name', 'geo_locations.country_code') // Group by both country_name and country_code
            ->orderBy('count', 'desc')
            ->get();
        return response()->json($ips);
    }

    public function per_country($country_code)
    {
        $ips = IPAddress::with(['geo_location']) // Include country_name and country_code
            ->whereHas('geo_location', function ($query) use ($country_code) {
                $query->where('country_code', $country_code);
            })
            ->get();
        return response()->json($ips);
    }
}
