<?php

namespace App\Models;

use App\Casts\IPAddressCast;
use Illuminate\Database\Eloquent\Model;

class WinFirewallLog extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

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

    public static function boot()
    {
        parent::boot();

        // Automatically set the captured_at timestamp to the current time if not provided
        static::created(function ($model) {
            \App\Events\IPLogged::dispatch(
                $model->source_ip->address,
                $model->source_ip->geo_location->latitude ?? null,
                $model->source_ip->geo_location->longitude ?? null,
                $model->device->name
            );
        });
    }

    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    public function source_ip()
    {
        return $this->belongsTo(IPAddress::class, 'source_address_id');
    }
}
