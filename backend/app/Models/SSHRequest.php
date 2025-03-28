<?php

namespace App\Models;

use App\Casts\IPAddressCast;
use Illuminate\Database\Eloquent\Model;

class SSHRequest extends Model
{
    protected $table = "ssh_requests";

    protected $fillable = [
        'device_id',
        'source_address_id',
        'captured_at',
        'process_name'
    ];

    protected $casts = [
        'source_address_id' => IPAddressCast::class,
        'captured_at' => 'datetime'
    ];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    public function sourceIP()
    {
        return $this->belongsTo(IPAddress::class, 'source_address_id');
    }
}
