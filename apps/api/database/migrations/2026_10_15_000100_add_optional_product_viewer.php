<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', fn (Blueprint $t) => $t->boolean('viewer_enabled')->default(false));
        // Preserve the old adapter's availability; new records keep the OFF default.
        DB::table('products')->whereNotNull('texture_id')->whereExists(fn ($q) => $q->selectRaw('1')->from('product_3d_configs')->whereColumn('product_id', 'products.id'))->update(['viewer_enabled' => true]);
        Schema::table('media', fn (Blueprint $t) => $t->string('asset_type', 16)->default('image'));
        Schema::table('product_3d_configs', function (Blueprint $t) {
            $t->string('source', 16)->default('procedural');
            $t->string('shape', 24)->nullable();
            $t->json('shape_parameters')->nullable();
            $t->json('parameter_limits')->nullable();
            $t->boolean('customer_dimensions')->default(false);
            $t->unsignedInteger('revision')->default(1);
            $t->foreignId('model_media_id')->nullable()->constrained('media')->restrictOnDelete();
            $t->boolean('model_approved')->default(false);
            foreach (['top', 'bottom', 'side'] as $face) {
                $t->foreignId($face.'_media_id')->nullable()->constrained('media')->restrictOnDelete();
            }
            $t->string('edge_finish', 16)->default('same');
        });
        DB::table('product_3d_configs')->whereExists(fn ($q) => $q->selectRaw('1')->from('product_formats')->whereColumn('product_formats.product_id', 'product_3d_configs.product_id')->where('allow_custom', true))->update(['customer_dimensions' => true]);
        Cache::forever('public-content-version',(string)Str::uuid());
    }

    public function down(): void
    {
        // Refuse to discard newly configured geometry or privately uploaded models.
        if (DB::table('media')->where('asset_type', 'model')->exists()
            || DB::table('product_3d_configs')->where(fn ($q) => $q->whereNotNull('shape')->orWhereNotNull('shape_parameters')->orWhereNotNull('top_media_id')->orWhereNotNull('bottom_media_id')->orWhereNotNull('side_media_id')->orWhere('source', '!=', 'procedural')->orWhere('edge_finish', '!=', 'same')->orWhere('revision', '>', 1))->exists()
            || DB::table('products')->where('viewer_enabled', false)->whereNotNull('texture_id')->whereExists(fn($q)=>$q->selectRaw('1')->from('product_3d_configs')->whereColumn('product_id','products.id'))->exists()) {
            throw new RuntimeException('Archive new viewer configurations/models before reversing this additive migration.');
        }
        Schema::table('product_3d_configs', function (Blueprint $t) {
            foreach (['model', 'top', 'bottom', 'side'] as $field) {
                $t->dropConstrainedForeignId($field.'_media_id');
            }
            $t->dropColumn(['source', 'shape', 'shape_parameters', 'parameter_limits', 'customer_dimensions', 'revision', 'model_approved', 'edge_finish']);
        });
        Schema::table('media', fn (Blueprint $t) => $t->dropColumn('asset_type'));
        Schema::table('products', fn (Blueprint $t) => $t->dropColumn('viewer_enabled'));
        Cache::forever('public-content-version',(string)Str::uuid());
    }
};
