<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quotation_requests', function (Blueprint $t) {
            $t->char('idempotency_key', 64)->nullable()->unique();
            $t->char('payload_hash', 64)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('quotation_requests', fn (Blueprint $t) => $t->dropColumn(['idempotency_key', 'payload_hash']));
    }
};
