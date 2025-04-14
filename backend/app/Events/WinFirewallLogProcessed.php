<?php

namespace App\Events;

use App\Helpers\Helper;
use App\Models\WinFirewallLog;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class WinFirewallLogProcessed extends BaseBroadcastingEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(private WinFirewallLog $win_firewall_log)
    {
        $this->win_firewall_log->load([
            'source_ip:id,address,is_local,is_blocked,is_tor_exit_node,is_vpn,is_datacenter,geo_location_id',
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
        $userIds = Helper::getUserIdsByDevice($this->win_firewall_log->device);
        $channels = [];
        foreach ($userIds as $user) {
            $channels[] = new PrivateChannel('App.Models.User.' . $user);
        }
        return $channels;
    }

    public function broadCastWith(): array
    {
        return [
            'winFirewallLog' => $this->win_firewall_log,
        ];
    }
}
