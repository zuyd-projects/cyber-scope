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
        Schema::table('ssh_requests', function (Blueprint $table) {
            $table->dropForeign(['device_id']);
            $table->dropForeign(['source_address_id']);

            // Re-add the foreign keys with cascadeOnDelete
            $table->foreign('device_id')->references('id')->on('devices')->cascadeOnDelete()->noActionOnUpdate();
            $table->foreign('source_address_id')->references('id')->on('ip_addresses')->cascadeOnDelete()->noActionOnUpdate();
        });

        Schema::table('packets', function (Blueprint $table) {
            $table->dropForeign(['device_id']);
            $table->dropForeign(['source_address_id']);
            $table->dropForeign(['destination_address_id']);

            // Re-add the foreign keys with cascadeOnDelete
            $table->foreign('device_id')->references('id')->on('devices')->cascadeOnDelete()->noActionOnUpdate();
            $table->foreign('source_address_id')->references('id')->on('ip_addresses')->cascadeOnDelete()->noActionOnUpdate();
            $table->foreign('destination_address_id')->references('id')->on('ip_addresses')->cascadeOnDelete()->noActionOnUpdate();
        });

        Schema::table('win_firewall_logs', function (Blueprint $table) {
            $table->dropForeign(['device_id']);
            $table->dropForeign(['source_address_id']);

            // Re-add the foreign keys with cascadeOnDelete
            $table->foreign('device_id')->references('id')->on('devices')->cascadeOnDelete()->noActionOnUpdate();
            $table->foreign('source_address_id')->references('id')->on('ip_addresses')->cascadeOnDelete()->noActionOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tables', function (Blueprint $table) {
            //
        });
    }
};
