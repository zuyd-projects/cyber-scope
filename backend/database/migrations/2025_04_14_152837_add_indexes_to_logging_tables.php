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
            $table->index('captured_at');
            $table->index(['device_id', 'captured_at']);
        });

        Schema::table('win_firewall_logs', function (Blueprint $table) {
            $table->index('captured_at');
            $table->index(['device_id', 'captured_at']);
        });

        Schema::table('packets', function (Blueprint $table) {
            $table->index('captured_at');
            $table->index(['device_id', 'captured_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('logging_tables', function (Blueprint $table) {
            //
        });
    }
};
