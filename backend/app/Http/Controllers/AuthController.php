<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }

    public function logout(Request $request)
    {
        $user = Auth::user();
        $user->tokens()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = \App\Models\User::create($data);

        return response()->json(['message' => 'User registered successfully', 'user' => $user], 201);
    }

    
}
