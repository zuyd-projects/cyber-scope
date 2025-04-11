<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('devices')->controller(\App\Http\Controllers\DeviceController::class)->group(function () {
        Route::get('/', 'index');
        Route::get('/{device}', 'show');
        Route::post('/', 'store');
        Route::put('/{device}', 'update');
        Route::delete('/{device}', 'destroy');
        Route::get('/{device}/users', 'get_users');
        Route::post('/{device}/add_user', 'add_user');
        Route::post('/{device}/remove_user', 'remove_user');
    });

    Route::prefix('firewall_logs')->controller(\App\Http\Controllers\FirewallLogController::class)->group(function () {
        Route::get('/', 'index');
        Route::get('/{device}', 'per_device');
    });

    Route::prefix('ssh_requests')->controller(\App\Http\Controllers\SSHRequestController::class)->group(function () {
        Route::get('/', 'index');
        Route::get('/{device}', 'per_device');
    });

    Route::prefix('packets')->controller(\App\Http\Controllers\PacketController::class)->group(function () {
        Route::get('/', 'index');
        Route::get('/{device}', 'per_device');
    });

    Route::prefix('ip_address')->controller(\App\Http\Controllers\IPAddressController::class)->group(function () {
        Route::get('/', 'index');
        Route::get('/search', 'search');
        Route::get('/by_country', 'by_country');
        Route::get('/by_country/{country_code}', 'per_country');
        Route::get('/{id}', 'show');
    });

    Route::prefix('graph')->controller(\App\Http\Controllers\GraphController::class)->group(function () {
        Route::get('/countries_by_connections', 'countries_by_connections');
    });
});
