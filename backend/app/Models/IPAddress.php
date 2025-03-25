<?php

namespace App\Models;

use App\Helpers\IPHelper;
use Illuminate\Database\Eloquent\Model;

class IPAddress extends Model
{
    protected $table = 'ip_addresses';
    protected $fillable = ['address', 'is_tor_exit_node', 'is_blocked', 'is_local'];

    public static function fromString($ip)
    {
        $isTorExitNode = IPHelper::isTorExitNode($ip);
        $isBlocked = IPHelper::isBlocked($ip);
        $isLocal = IPHelper::isLocal($ip);

        return self::firstOrCreate([
            'address' => $ip,
            'is_tor_exit_node' => $isTorExitNode,
            'is_blocked' => $isBlocked,
            'is_local' => $isLocal
        ]);
    }
}
