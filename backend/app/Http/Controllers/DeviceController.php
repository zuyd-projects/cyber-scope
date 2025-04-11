<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DeviceController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->can('viewAny', \App\Models\Device::class)) {
            $devices = \App\Models\Device::all();
        } else {
            $devices = $request->user()->devices()->get();
        }
        
        return response()->json($devices);
    }

    public function show($id)
    {
        $device = \App\Models\Device::find($id);
        if (!$device) {
            return response()->json(['message' => 'Device not found'], 404);
        }
        return response()->json($device);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'key' => 'required|string|max:255|unique:devices,key'
        ]);

        $device = \App\Models\Device::create($validated);
        return response()->json($device, 201);
    }

    public function update(Request $request, $id)
    {
        $device = \App\Models\Device::find($id);
        if (!$device) {
            return response()->json(['message' => 'Device not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'key' => 'prohibited',
        ]);

        $device->update($validated);
        return response()->json($device);
    }

    public function destroy($id)
    {
        $device = \App\Models\Device::find($id);
        if (!$device) {
            return response()->json(['message' => 'Device not found'], 404);
        }

        $device->delete();
        return response()->json(['message' => 'Device deleted successfully']);
    }
}
