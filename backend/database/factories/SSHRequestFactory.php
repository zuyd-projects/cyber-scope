<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SSHRequest>
 */
class SSHRequestFactory extends Factory
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
            'source_address_id' => \App\Models\IPAddress::inRandomOrder()->first()->id,
            'captured_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'process_name' => 'sshd'
        ];
    }
}
