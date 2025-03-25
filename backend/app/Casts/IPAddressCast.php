<?php

namespace App\Casts;

use App\Models\IPAddress;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class IPAddressCast implements CastsAttributes
{
    /**
     * Cast the given value.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        return $value;
    }

    /**
     * Prepare the given value for storage.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        if (filter_var($value, FILTER_VALIDATE_IP)) {
            $ipAddress = IPAddress::fromString($value);
            return $ipAddress->id;
        }

        return $value;
    }
}
