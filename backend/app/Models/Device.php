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
}
