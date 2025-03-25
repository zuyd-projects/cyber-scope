<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('packets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained();
            $table->foreignId('source_address_id')->constrained('ip_addresses');
            $table->foreignId('destination_address_id')->constrained('ip_addresses');
            $table->string('protocol');
            $table->integer('source_port');
            $table->integer('destination_port');
            $table->integer('size');
            $table->timestamp('captured_at');
            $table->integer('process_id')->nullable();
            $table->string('process_name')->nullable();
            $table->string('process_path')->nullable();
            $table->string('process_file_hash')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packets');
    }
};
