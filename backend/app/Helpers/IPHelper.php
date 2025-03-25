<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Cache;

class IPHelper
{
    public static function getTorExitNodes()
    {
        return Cache::remember('tor_exit_nodes', 60 * 60, function () {
            $torExitNodes = file_get_contents('https://check.torproject.org/exit-addresses');
            $nodes = explode("ExitNode ", $torExitNodes);

            $updated_data = [];

            foreach ($nodes as $node) {
                if (empty($node)) continue;
                $data = explode(" ", $node);

                $id = explode("\n", $data[0])[0];
                $ip = $data[5];

                $updated_data[$ip] = $id;
            }

            return $updated_data;
        });
    }

    public static function getTorExitNodeByIP($ip)
    {
        $torExitNodes = self::getTorExitNodes();
        return $torExitNodes[$ip] ?? null;
    }

    public static function isTorExitNode($ip)
    {
        return self::getTorExitNodeByIP($ip) !== null;
    }

    public static function getBlockedIPs()
    {
        return Cache::remember('blocked_ips', 60 * 60, function () {
            $blocklist = file_get_contents('https://lists.blocklist.de/lists/all.txt');
            return explode("\n", $blocklist);
        });
    }

    public static function isBlocked($ip)
    {
        return in_array($ip, self::getBlockedIPs());
    }

    public static function isLocal($ip)
    {
        return filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false;
    }
}
