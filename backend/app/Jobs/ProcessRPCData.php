<?php

namespace App\Jobs;

use App\Models\Device;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class ProcessRPCData implements ShouldQueue
{
    use Queueable;

    public array $data;
    /**
     * Create a new job instance.
     */
    public function __construct(public string $source, string $data)
    {
        $decodedData = json_decode($data, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $this->data = $decodedData;
        } else {
            $this->data = [];
            Log::error("Failed to decode JSON data: " . json_last_error_msg());
            // Do not run the job if the data is invalid
            $this->release(0);
        }
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        switch ($this->source) {
            case "packet":
                $this->processPacket();
                break;
            case "linuxLog":
                $this->processLinux();
                break;
            case "windowsLog":
                $this->processWindows();
                break;
            default:
                Log::error("Unknown source: {$this->source}");
                Log::info($this->data);
                break;
        }
    }

    private function processPacket(): void
    {
        $device = Device::firstOrCreate([
            'key' => $this->data['deviceId']
        ], [
            'name' => $this->data['deviceId']
        ]);

        $packet = $device->packets()->create([
            'source_address_id' => $this->data['sourceIp'],
            'destination_address_id' => $this->data['destinationIp'],
            // 'protocol' => $this->data['protocol'],
            'source_port' => $this->data['sourcePort'],
            'destination_port' => $this->data['destinationPort'],
            'size' => $this->data['size'] ?? 0,
            'captured_at' => $this->data['timestamp'],
            'process_id' => $this->data['processId'] ?? null,
            'process_name' => $this->data['processName'] ?? null,
            'process_path' => $this->data['executablePath'] ?? null,
            'process_file_hash' => $this->data['fileHash'] ?? null
        ]);
    }

    private function processLinux(): void
    {
        $device = Device::firstOrCreate([
            'key' => $this->data['deviceId']
        ], [
            'name' => $this->data['deviceId']
        ]);

        $ssh = $device->ssh_requests()->create([
            'source_address_id' => $this->data['sourceIp'],
            'captured_at' => $this->data['timestamp'],
            'process_name' => $this->data['processName'] ?? null
        ]);
    }

    private function processWindows(): void
    {
        $device = Device::firstOrCreate([
            'key' => $this->data['deviceId']
        ], [
            'name' => $this->data['deviceId']
        ]);

        $winlog = $device->win_firewall_logs()->create([
            'source_address_id' => $this->data['sourceIp'],
            'captured_at' => $this->data['timestamp'],
            'action' => $this->data['action'],
            'source_port' => $this->data['srcPort'] ?? null,
            'destination_port' => $this->data['dstPort'] ?? null,
        ]);
    }
}
