<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

abstract class BaseBroadcastingEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The name of the queue connection to use.
     *
     * @var string|null
     */
    public $connection;

    /**
     * The name of the queue to use.
     *
     * @var string|null
     */
    public $queue;

    /**
     * Create a new event instance.
     */
    public function __construct()
    {
        $this->connection = env('BROADCAST_QUEUE_CONNECTION', 'default');
        $this->queue = env('BROADCAST_QUEUE_NAME', 'default');
    }

    /**
     * Get the broadcast connection name.
     *
     * @return string|null
     */
    public function broadcastConnection()
    {
        return $this->connection;
    }

    /**
     * Get the broadcast queue name.
     *
     * @return string|null
     */
    public function broadcastQueue()
    {
        return $this->queue;
    }
}
