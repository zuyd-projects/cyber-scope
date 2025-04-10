<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $ips = [
            '66.22.196.36',
            '86.82.163.85',
            '52.108.50.36',
            '43.153.11.53',
            '201.245.225.203',
            '82.64.88.74',
            '177.43.43.211',
            '92.255.85.188',
            '213.55.85.202',
            '193.151.145.20',
            '111.171.125.94',
            '92.255.85.253',
            '92.255.85.189',
            '196.46.200.113',
            '104.205.140.176',
            '103.146.51.20',
            '80.94.95.112',
            '220.80.192.168',
            '222.106.198.35',
            '122.160.46.61',
            '50.6.196.35',
            '59.183.63.78'
        ];
        if (\App\Models\IPAddress::count() < 5) {
            $ipobjects = array_map(function ($ip) {
                return \App\Models\IPAddress::fromString($ip)->id;
            }, $ips);
        }

        $device_count = \App\Models\Device::count();
        if ($device_count < 5) {
            \App\Models\Device::factory(5 - $device_count)->create();
        }

        if (\App\Models\WinFirewallLog::count() < 100) {
            \App\Models\WinFirewallLog::withoutEvents(function () {
                \App\Models\WinFirewallLog::factory(100)->create();
            });
        }
        if (\App\Models\SSHRequest::count() < 100) {
            \App\Models\SSHRequest::withoutEvents(function () {
                \App\Models\SSHRequest::factory(100)->create();
            });
        }
    }
}
