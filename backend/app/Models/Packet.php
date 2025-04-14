<?php

namespace App\Models;

use App\Casts\IPAddressCast;
use Illuminate\Database\Eloquent\Model;

class Packet extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $fillable = [
        'device_id',
        'source_address_id',
        'destination_address_id',
        'protocol',
        'source_port',
        'destination_port',
        'size',
        'captured_at',
        'process_id',
        'process_name',
        'process_path',
        'process_file_hash'
    ];

    protected $casts = [
        'captured_at' => 'datetime',
        'source_address_id' => IPAddressCast::class,
        'destination_address_id' => IPAddressCast::class
    ];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    public function source_ip()
    {
        return $this->belongsTo(IPAddress::class, 'source_address_id');
    }

    public function destination_ip()
    {
        return $this->belongsTo(IPAddress::class, 'destination_address_id');
    }
}
