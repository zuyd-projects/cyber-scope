<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Packet>
 */
class PacketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'device_id' => \App\Models\Device::inRandomOrder()->first()->id,
            'source_address_id' => \App\Models\IPAddress::where('is_local', true)->inRandomOrder()->first()->id,
            'destination_address_id' => \App\Models\IPAddress::where('is_local', false)->inRandomOrder()->first()->id,
            'captured_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'source_port' => $this->faker->numberBetween(1024, 65535),
            'destination_port' => $this->faker->numberBetween(1024, 65535),
            'size' => $this->faker->numberBetween(40, 1500)
        ];
    }
}
