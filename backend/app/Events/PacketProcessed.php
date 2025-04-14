<?php

namespace App\Events;

use App\Helpers\Helper;
use App\Models\Packet;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PacketProcessed extends BaseBroadcastingEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(private Packet $packet)
    {
        $this->packet->load([
            'source_ip:id,address,geo_location_id',
            'source_ip.geo_location:id,latitude,longitude',
            'destination_ip:id,address,geo_location_id',
            'destination_ip.geo_location:id,latitude,longitude'
        ]);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $userIds = Helper::getUserIdsByDevice($this->packet->device);
        $channels = [];
        foreach ($userIds as $user) {
            $channels[] = new PrivateChannel('App.Models.User.' . $user);
        }
        return $channels;
    }

    public function broadCastWith(): array
    {
        return [
            'packet' => $this->packet,
        ];
    }
}
