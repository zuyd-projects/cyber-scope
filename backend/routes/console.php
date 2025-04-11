<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

// Import schedule.php from routes folder
require base_path('routes/schedule.php');

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('app:fetch-ip2locations', function () {
    $this->comment('Downloading database...');

    $url = 'https://cdn.rickokkersen.nl/IP2LOCATION.BIN';
    $destinationPath = storage_path('app/ip2location/IP2LOCATION.BIN');

    // Ensure the destination directory exists
    if (!is_dir(dirname($destinationPath))) {
        mkdir(dirname($destinationPath), 0755, true);
    }

    // Open the source and destination streams
    $source = fopen($url, 'r');
    if ($source === false) {
        $this->error('Failed to open the URL for reading.');
        return;
    }

    $destination = fopen($destinationPath, 'w');
    if ($destination === false) {
        fclose($source);
        $this->error('Failed to open the destination file for writing.');
        return;
    }

    // Stream the file in chunks
    $bytesCopied = stream_copy_to_stream($source, $destination);
    fclose($source);
    fclose($destination);

    if ($bytesCopied === false) {
        $this->error('Failed to download the database.');
        return;
    }

    $this->info("Database downloaded successfully! ($bytesCopied bytes copied)");
})->purpose('Fetch the IP2Location database');

Artisan::command('queue:stats', function () {
    Artisan::call('queue:monitor redis:ws,redis:grpc');
})->purpose('Monitor the queue for jobs');

Artisan::command('app:cleanup-data', function () {
    \App\Jobs\CleanupData::dispatch();
})->purpose('Cleanup old data from the database');
