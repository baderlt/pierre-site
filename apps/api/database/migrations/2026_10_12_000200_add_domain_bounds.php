<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['product_3d_configs', 'product_formats', 'quotation_items'] as $table) {
            foreach (['width', 'height', 'thickness'] as $d) {
                DB::statement("ALTER TABLE `$table` ADD CONSTRAINT `{$table}_{$d}_bounds` CHECK (`$d` BETWEEN 0.5 AND 500)");
            }
        }
        foreach (['scale' => [.25, 4], 'rotation' => [0, 360], 'roughness' => [0, 1], 'metalness' => [0, 1], 'bump_strength' => [0, 1]] as $field => [$min,$max]) {
            DB::statement("ALTER TABLE `product_3d_configs` ADD CONSTRAINT `config_{$field}_bounds` CHECK (`$field` BETWEEN $min AND $max)");
        }
        DB::statement('ALTER TABLE product_3d_configs ADD CONSTRAINT config_version CHECK (version = 1)');
        DB::statement("ALTER TABLE quotation_items ADD CONSTRAINT quote_quantity_bounds CHECK (quantity > 0 AND quantity <= 1000000 AND (unit <> 'piece' OR quantity = FLOOR(quantity)))");
    }

    public function down(): void
    {
        foreach (['product_3d_configs', 'product_formats', 'quotation_items'] as $table) {
            foreach (['width', 'height', 'thickness'] as $d) {
                DB::statement("ALTER TABLE `$table` DROP CHECK `{$table}_{$d}_bounds`");
            }
        }
        foreach (['scale', 'rotation', 'roughness', 'metalness', 'bump_strength'] as $field) {
            DB::statement("ALTER TABLE product_3d_configs DROP CHECK `config_{$field}_bounds`");
        }
        DB::statement('ALTER TABLE product_3d_configs DROP CHECK config_version');
        DB::statement('ALTER TABLE quotation_items DROP CHECK quote_quantity_bounds');
    }
};
