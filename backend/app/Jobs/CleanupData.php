<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class CleanupData implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info('Starting data cleanup job');
        // Delete all logs older than 30 days
        $q = \App\Models\Packet::where('captured_at', '<', now()->subDays(30));
        Log::info('Deleted '.$q->count().' packets older than 30 days');
        $q->delete();
        $s = \App\Models\SSHRequest::where('captured_at', '<', now()->subDays(30));
        Log::info('Deleted '.$s->count().' SSH requests older than 30 days');
        $s->delete();
        $f = \App\Models\WinFirewallLog::where('captured_at', '<', now()->subDays(30));
        Log::info('Deleted '.$f->count().' firewall logs older than 30 days');
        $f->delete();

        // Delete all IP addresses that have no associated firewall logs, SSH requests, or packets
        $i = \App\Models\IPAddress::whereDoesntHave('win_firewall_logs')
            ->whereDoesntHave('ssh_requests')
            ->whereDoesntHave('packets');
        Log::info('Deleted '.$i->count().' IP addresses with no associated logs');
        $i->delete();

        // Delete all geo locations that have no associated IP addresses
        $g = \App\Models\GeoLocation::whereDoesntHave('ip_addresses');
        Log::info('Deleted '.$g->count().' geo locations with no associated IP addresses');
        $g->delete();

        // Delete all devices that have no associated firewall logs, SSH requests, or packets
        $d = \App\Models\Device::whereDoesntHave('win_firewall_logs')
            ->whereDoesntHave('ssh_requests')
            ->whereDoesntHave('packets');
        Log::info('Deleted '.$d->count().' devices with no associated logs');
        $d->delete();

        Log::info("Data cleanup job completed successfully");
    }
}
