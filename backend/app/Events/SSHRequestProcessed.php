<?php

namespace App\Events;

use App\Helpers\Helper;
use App\Models\SSHRequest;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class SSHRequestProcessed extends BaseBroadcastingEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(private SSHRequest $sshRequest)
    {
        $this->sshRequest->load([
            'source_ip:id,address,geo_location_id',
            'source_ip.geo_location:id,latitude,longitude'
        ]);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $userIds = Helper::getUserIdsByDevice($this->sshRequest->device);
        $channels = [];
        foreach ($userIds as $user) {
            $channels[] = new PrivateChannel('App.Models.User.' . $user);
        }
        return $channels;
    }

    public function broadCastWith(): array
    {
        return [
            'sshRequest' => $this->sshRequest,
        ];
    }
}
