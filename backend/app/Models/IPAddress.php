<?php

namespace App\Models;

use App\Helpers\IPHelper;
use Illuminate\Database\Eloquent\Model;

class IPAddress extends Model
{
    protected $table = 'ip_addresses';
    protected $fillable = ['address', 'is_tor_exit_node', 'is_blocked', 'is_local', 'is_vpn', 'is_datacenter', 'geo_location_id'];

    public static function fromString($ip)
    {
        $data = [
            'address' => $ip,
            'geo_location_id' => GeoLocation::fromIp($ip)->id,
            'is_tor_exit_node' => IPHelper::isTorExitNode($ip),
            'is_blocked' => IPHelper::isBlocked($ip),
            'is_local' => IPHelper::isLocal($ip),
            'is_vpn' => IPHelper::isVPN($ip),
            'is_datacenter' => IPHelper::isDatacenter($ip)
        ];

        $existing = self::where($data)->first();

        if ($existing) {
            // If a matching record exists, return it
            return $existing;
        }

        // Otherwise, create a new record
        return self::create($data);
    }

    public function geo_location()
    {
        return $this->belongsTo(GeoLocation::class, 'geo_location_id');
    }

    public function packets()
    {
        return $this->hasMany(Packet::class, 'destination_address_id');
    }

    public function ssh_requests()
    {
        return $this->hasMany(SshRequest::class, 'source_address_id');
    }

    public function win_firewall_logs()
    {
        return $this->hasMany(WinFirewallLog::class, 'source_address_id');
    }
}
