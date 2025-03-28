<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    protected $fillable = ['name', 'key'];

    public function packets()
    {
        return $this->hasMany(Packet::class);
    }

    public function ssh_requests()
    {
        return $this->hasMany(SSHRequest::class);
    }
}
