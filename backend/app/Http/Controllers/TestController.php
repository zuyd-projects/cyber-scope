<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Helpers\IPHelper;
use App\Models\IPAddress;
use Illuminate\Http\Request;
use PhpParser\Node\Stmt\Continue_;


class TestController extends Controller
{
    public function index()
    {
        // $torExitNodes = file_get_contents('https://check.torproject.org/exit-addresses');
        // $nodes = explode("ExitNode ", $torExitNodes);

        // $updated_data = [];

        // foreach ($nodes as $node) {
        //     if (empty($node)) continue;
        //     $data = explode(" ", $node);

        //     $id = explode("\n", $data[0])[0];
        //     $ip = $data[5];

        //     $updated_data[$ip] = $id;
        // }

        // KNOWN GOOD
        // $data = "O:23:\"App\\Jobs\\ProcessRPCData\":2:{s:4:\"data\";a:0:{}s:6:\"source\";s:4:\"test\";}";

        // $data = unserialize($data);

        // // KNOWN BAD
        // $test = 'a:2:{s:4:"data";a:1:{s:8:"deviceId";s:19:"1234-5678-1234-5678";}s:6:"source";s:4:"test";}';

        // $test = unserialize($test);

        // $try = "O:23:\"App\\Jobs\\ProcessRPCData\":2:{s:4:\"data\";a:11:{s:8:\"deviceId\";s:19:\"1234-5678-1234-5678\";s:8:\"sourceIp\";s:13:\"192.168.1.252\";s:13:\"destinationIp\";s:12:\"35.81.90.104\";s:10:\"sourcePort\";i:64977;s:15:\"destinationPort\";i:443;s:4:\"size\";i:2;s:9:\"timestamp\";s:19:\"24/03/2025 16:46:30\";s:9:\"processId\";i:5640;s:11:\"processName\";s:4:\"Lens\";s:14:\"executablePath\";s:62:\"C:\\Users\\Underlyingglitch\\AppData\\Local\\Programs\\Lens\\Lens.exe\";s:8:\"fileHash\";s:64:\"046E61543C175EC25E50E0BFDB08CD9800ABBFD64569FF5DF1D8ECC26749614C\";}s:6:\"source\";s:4:\"test\";}";

        // $try = unserialize($try);

        // dd($try);


        // $test = file_get_contents("https://raw.githubusercontent.com/X4BNet/lists_vpn/refs/heads/main/output/vpn/ipv4.txt");
        // $test = explode("\n", $test);
        // $test = array_filter($test);
        // $test = array_map([IPHelper::class, 'getAddressesFromRange'], $test);
        // dd($test);

        // dd(\Carbon\Carbon::parse('2025-03-28T11:20:54.608028+01:00'));

        // $records = \Ip2location\IP2LocationLaravel\Facade\IP2LocationLaravel::get('96.16.53.150', 'bin');

        // $fields = [
        //     'ipNumber',
        //     'ipVersion',
        //     'ipAddress',
        //     'latitude',
        //     'longitude',
        //     'countryName',
        //     'countryCode',
        //     'timeZone',
        //     'zipCode',
        //     'cityName',
        //     'regionName',
        // ];

        // // Filter the array using array_intersect_key
        // $filteredRecords = array_intersect_key($records, array_flip($fields));

        // dd($filteredRecords);
        // // dd($records);
        // // foreach (IPAddress::all() as $ip) {
        // //     if (IPHelper::isDatacenter($ip->address)) {
        // //         return $ip->address;
        // //     }
        // // }
        // dd(IPHelper::isIPv4('192.168.1.1'), IPHelper::isIPv4('2001:0db8:85a3:0000:0000:8a2e:0370:7334'));

        return Device::all();
    }
}
