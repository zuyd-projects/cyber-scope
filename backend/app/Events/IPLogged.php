<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class IPLogged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $queue = 'ws';
    public $connection = 'redis';

    /**
     * Create a new event instance.
     */
    public function __construct(
        private string $address,
        private float $lat,
        private float $lng,
        private string $hostname
    ) {}

    public function shoudlDispatch(): bool
    {
        // If $object is a SSHRequest class, set the properties accordingly
        return (($this->address && $this->lat && $this->lng) && !($this->lat == '-' || $this->lng == '-'));
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('globe'),
        ];
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'address' => $this->address,
            'lat' => $this->lat,
            'lng' => $this->lng,
            'hostname' => $this->hostname
        ];
    }

    /**
     * Get the name of the event.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'IPLogged';
    }
}
