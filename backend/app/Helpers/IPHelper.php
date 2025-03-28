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

    /**
     * Get the start and end IP addresses from a CIDR range in integer form 
     * @param string $range
     * @return array [start, end]
     */
    public static function getAddressesFromRange($range)
    {
        $range = explode("/", $range);
        $start = ip2long($range[0]);
        $end = $start + pow(2, (32 - $range[1])) - 1;

        return [$start, $end];
    }

    /**
     * Check if an IP address is within a range
     * @param string|int $ip
     * @param string $range
     * @return bool
     */
    public static function isInRange($ip, $range)
    {
        $ip = self::normalizeIP($ip);
        if (!$ip) return false;
        if (is_string($range)) {
            $range = self::getAddressesFromRange($range);
        }

        return $ip >= $range[0] && $ip <= $range[1];
    }

    /**
     * Normalize an IP address to an integer format
     * @param string|int $ip
     * @return int
     */
    public static function normalizeIP($ip)
    {
        if (is_int($ip)) {
            return $ip;
        }

        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            return ip2long($ip);
        }

        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
            return false;
        }

        throw new \InvalidArgumentException("Invalid IP address format: $ip");
    }

    public static function getVPNRanges()
    {
        return Cache::remember('vpn_ranges', 60 * 60 * 24, function () {
            $data = file_get_contents('https://raw.githubusercontent.com/X4BNet/lists_vpn/refs/heads/main/output/vpn/ipv4.txt');
            $ranges = explode("\n", $data);
            $ranges = array_filter($ranges);
            return array_map([self::class, 'getAddressesFromRange'], $ranges);
        });
    }

    public static function isVPN($ip)
    {
        foreach (self::getVPNRanges() as $range) {
            if (self::isInRange($ip, $range)) {
                return true;
            }
        }

        return false;
    }

    public static function getDatacenterRanges()
    {
        return Cache::remember('dc_ranges', 60 * 60 * 24, function () {
            $data = file_get_contents('https://raw.githubusercontent.com/X4BNet/lists_vpn/refs/heads/main/output/datacenter/ipv4.txt');
            $ranges = explode("\n", $data);
            $ranges = array_filter($ranges);
            return array_map([self::class, 'getAddressesFromRange'], $ranges);
        });
    }

    public static function isDatacenter($ip)
    {
        foreach (self::getDatacenterRanges() as $range) {
            if (self::isInRange($ip, $range)) {
                return true;
            }
        }

        return false;
    }

    public static function isIPv4($ip)
    {
        return filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) !== false;
    }
}
