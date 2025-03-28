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
        Schema::table('geo_locations', function (Blueprint $table) {
            $table->dropForeign(['ip_address_id']);
            $table->dropColumn('ip_address_id');
        });
        Schema::table('ip_addresses', function (Blueprint $table) {
            $table->foreignId('geo_location_id')->nullable()->after('is_datacenter')->constrained('geo_locations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
