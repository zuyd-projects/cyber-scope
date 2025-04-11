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

    public function add_user($id,Request $request)
    {
        $device = \App\Models\Device::find($id);
        if (!$device) {
            return response()->json(['message' => 'Device not found'], 404);
        }

        if ($request->user()->cannot('update', $device)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'email' => 'required|exists:users,email',
        ]);

        $user = \App\Models\User::where('email', $validated['email'])->first();

        if ($device->users()->where('user_id', $user->id)->exists() || $user->is_admin) {
            return response()->json(['message' => 'User already added to device'], 409);
        }

        $device->users()->attach($user);
        return response()->json(['message' => 'User added to device successfully']);
    }

    public function remove_user($id,Request $request)
    {
        $device = \App\Models\Device::find($id);
        if (!$device) {
            return response()->json(['message' => 'Device not found'], 404);
        }

        if ($request->user()->cannot('update', $device)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'email' => 'required|exists:users,email',
        ]);

        $user = \App\Models\User::where('email', $validated['email'])->first();
        if ($user->is_admin) {
            return response()->json(['message' => 'Cannot remove admin user'], 403);
        }
        
        if (!$device->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'User not found on device'], 404);
        }
        $device->users()->detach($user);
        return response()->json(['message' => 'User removed from device successfully']);
    }
}
