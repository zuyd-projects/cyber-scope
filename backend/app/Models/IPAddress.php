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

        return self::firstOrCreate($data);
    }

    public function geoLocation()
    {
        return $this->belongsTo(GeoLocation::class);
    }
}
