<?php

namespace App\Models;

use App\Casts\IPAddressCast;
use Illuminate\Database\Eloquent\Model;

class WinFirewallLog extends Model
{
    protected $fillable = [
        'device_id',
        'source_address_id',
        'captured_at',
        'action',
        'source_port',
        'destination_port',
    ];

    protected $casts = [
        'source_address_id' => IPAddressCast::class,
        'captured_at' => 'datetime'
    ];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }
}
