<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', fn (Blueprint $table) => $table->string('maps_directions_url', 2048)->nullable());
    }

    public function down(): void
    {
        Schema::table('site_settings', fn (Blueprint $table) => $table->dropColumn('maps_directions_url'));
    }
};
