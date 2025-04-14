<?php

namespace App\Events;

use App\Helpers\Helper;
use App\Models\User;
use App\Models\Device;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class DeviceUpdated extends BaseBroadcastingEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(private Device $device) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $userIds = Helper::getUserIdsByDevice($this->device);
        $channels = [];
        foreach ($userIds as $user) {
            $channels[] = new PrivateChannel('App.Models.User.' . $user);
        }
        return $channels;
    }

    public function broadCastWith(): array
    {
        return [
            'device' => $this->device,
        ];
    }
}
