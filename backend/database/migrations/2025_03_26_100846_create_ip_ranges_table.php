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
        Schema::create('ip_ranges', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('start_ip');
            $table->unsignedBigInteger('end_ip');
            $table->string('country', 5);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ip_ranges');
    }
};
