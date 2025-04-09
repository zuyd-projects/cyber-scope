<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GeoLocation extends Model
{
    protected $fillable = [
        'ip_version',
        'latitude',
        'longitude',
        'country_name',
        'country_code',
        'region_name',
        'city_name',
        'zip_code',
        'time_zone'
    ];

    public static function fromIp($ip)
    {
        $geoData = \Ip2location\IP2LocationLaravel\Facade\IP2LocationLaravel::get($ip, 'bin');

        $data = [
            'ip_version' => $geoData['ipVersion'],
            'latitude' => $geoData['latitude'],
            'longitude' => $geoData['longitude'],
            'country_name' => $geoData['countryName'],
            'country_code' => $geoData['countryCode'],
            'region_name' => $geoData['regionName'],
            'city_name' => $geoData['cityName'],
            'zip_code' => $geoData['zipCode'],
            'time_zone' => $geoData['timeZone']
        ];

        $existing = self::where($data)->first();

        if ($existing) {
            // If a matching record exists, return it
            return $existing;
        }

        // Otherwise, create a new record
        return self::create($data);
    }

    public function ipAddress()
    {
        return $this->hasMany(IpAddress::class);
    }
}
