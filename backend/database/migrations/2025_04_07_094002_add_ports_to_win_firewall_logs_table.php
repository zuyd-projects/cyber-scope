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
        Schema::table('win_firewall_logs', function (Blueprint $table) {
            $table->unsignedInteger('source_port')->nullable()->after('source_address_id');
            $table->unsignedInteger('destination_port')->nullable()->after('source_port');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('win_firewall_logs', function (Blueprint $table) {
            $table->dropColumn('source_port');
            $table->dropColumn('destination_port');
        });
    }
};
