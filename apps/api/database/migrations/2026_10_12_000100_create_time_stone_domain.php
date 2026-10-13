<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $t) {
            $t->enum('role', ['super_admin', 'content_manager'])->default('content_manager');
            $t->boolean('active')->default(false)->index();
        });
        Schema::create('media', function (Blueprint $t) {
            $t->id();
            $t->string('original_filename');
            $t->string('disk')->default('local');
            $t->string('path')->unique();
            $t->string('mime', 80);
            $t->unsignedBigInteger('bytes');
            $t->unsignedInteger('width');
            $t->unsignedInteger('height');
            $t->enum('purpose', ['image', 'texture', 'logo', 'favicon'])->default('image');
            $t->enum('processing_status', ['ready', 'failed'])->default('ready');
            $t->json('derivatives');
            $t->timestamp('uploaded_at');
            $t->timestamps();
        });
        foreach (['categories', 'stone_types', 'finishes', 'formats', 'colors'] as $table) {
            Schema::create($table, function (Blueprint $t) use ($table) {
                $t->id();
                $t->string('slug', 100)->unique();
                $t->boolean('active')->default(true);
                $t->unsignedInteger('sort_order')->default(0);
                $t->foreignId('image_id')->nullable()->constrained('media')->restrictOnDelete();
                if ($table === 'stone_types') {
                    $t->string('classification', 80)->nullable();
                    $t->text('internal_notes')->nullable();
                }
                if ($table === 'finishes') {
                    $t->enum('simulation', ['honed', 'polished', 'rough'])->nullable();
                }
                if ($table === 'formats') {
                    $t->enum('geometry', ['slab', 'tile', 'block']);
                }
                if ($table === 'colors') {
                    $t->string('swatch', 7)->default('#d8c7ac');
                }
                $t->timestamps();
                $t->index(['active', 'sort_order']);
            });
        }
        Schema::create('products', function (Blueprint $t) {
            $t->id();
            $t->string('slug', 100)->unique();
            $t->string('sku', 100)->nullable()->unique();
            $t->foreignId('category_id')->constrained()->restrictOnDelete();
            $t->foreignId('stone_type_id')->constrained()->restrictOnDelete();
            $t->enum('status', ['draft', 'published'])->default('draft');
            $t->boolean('featured')->default(false);
            $t->unsignedInteger('sort_order')->default(0);
            $t->boolean('illustrative')->default(true);
            foreach (['main_image_id', 'texture_id', 'og_image_id'] as $column) {
                $t->foreignId($column)->nullable()->constrained('media')->restrictOnDelete();
            }
            $t->timestamp('published_at')->nullable();
            $t->timestamps();
            $t->index(['status', 'published_at', 'id']);
            $t->index(['category_id', 'status']);
            $t->index(['stone_type_id', 'status']);
            $t->index(['featured', 'sort_order', 'id']);
        });
        Schema::create('applications', function (Blueprint $t) {
            $t->id();
            $t->string('slug', 100)->unique();
            $t->enum('status', ['draft', 'published'])->default('draft');
            $t->foreignId('image_id')->nullable()->constrained('media')->restrictOnDelete();
            $t->boolean('illustrative')->default(true);
            $t->unsignedInteger('sort_order')->default(0);
            $t->timestamp('published_at')->nullable();
            $t->timestamps();
            $t->index(['status', 'sort_order']);
        });
        Schema::create('pages', function (Blueprint $t) {
            $t->id();
            $t->string('slug', 100)->unique();
            $t->enum('status', ['draft', 'published'])->default('draft');
            $t->foreignId('og_image_id')->nullable()->constrained('media')->restrictOnDelete();
            $t->timestamp('published_at')->nullable();
            $t->timestamps();
        });
        Schema::create('page_sections', function (Blueprint $t) {
            $t->id();
            $t->foreignId('page_id')->constrained()->cascadeOnDelete();
            $t->enum('type', ['hero', 'story', 'image_text', 'cta', 'navigation', 'footer', 'quality']);
            $t->string('key', 100);
            $t->string('link_path')->nullable();
            $t->boolean('visible')->default(true);
            $t->foreignId('image_id')->nullable()->constrained('media')->restrictOnDelete();
            $t->unsignedInteger('sort_order')->default(0);
            $t->timestamps();
            $t->unique(['page_id', 'key']);
        });
        foreach (['category', 'stone_type', 'finish', 'format', 'color', 'product', 'application', 'page', 'page_section', 'media'] as $entity) {
            $parent = $entity === 'media' ? 'media' : Str::plural($entity);
            Schema::create($entity.'_translations', function (Blueprint $t) use ($entity, $parent) {
                $t->id();
                $t->foreignId($entity.'_id')->constrained($parent)->cascadeOnDelete();
                $t->enum('locale', ['fr', 'en', 'ar']);
                $t->string('name', 200);
                $t->text('description')->nullable();
                $t->string('seo_title', 200)->nullable();
                $t->string('seo_description', 500)->nullable();
                $t->string('cta_label', 100)->nullable();
                $t->timestamps();
                $t->unique([$entity.'_id', 'locale']);
            });
        }
        foreach ([['product', 'finish'], ['product', 'color'], ['application', 'product'], ['stone_type', 'finish'], ['stone_type', 'color'], ['stone_type', 'media']] as [$a, $b]) {
            Schema::create($a.'_'.$b, function (Blueprint $t) use ($a, $b) {
                $t->foreignId($a.'_id')->constrained($a === 'media' ? 'media' : Str::plural($a))->cascadeOnDelete();
                $t->foreignId($b.'_id')->constrained($b === 'media' ? 'media' : Str::plural($b))->restrictOnDelete();
                $t->primary([$a.'_id', $b.'_id']);
                $t->index($b.'_id');
            });
        }
        Schema::create('product_formats', function (Blueprint $t) {
            $t->id();
            $t->foreignId('product_id')->constrained()->cascadeOnDelete();
            $t->foreignId('format_id')->constrained()->restrictOnDelete();
            foreach (['width', 'height', 'thickness'] as $d) {
                $t->decimal($d, 7, 2)->default($d === 'thickness' ? 3 : 120);
            }
            $t->boolean('verified')->default(false);
            $t->boolean('allow_custom')->default(false);
            $t->unique(['product_id', 'format_id']);
        });
        Schema::create('product_3d_configs', function (Blueprint $t) {
            $t->id();
            $t->foreignId('product_id')->unique()->constrained()->cascadeOnDelete();
            $t->unsignedTinyInteger('version')->default(1);
            $t->enum('geometry', ['slab', 'block', 'tile'])->default('slab');
            foreach (['width', 'height', 'thickness'] as $d) {
                $t->decimal($d, 7, 2)->default($d === 'thickness' ? 3 : 120);
            }
            $t->boolean('dimensions_verified')->default(false);
            $t->enum('finish', ['honed', 'polished', 'rough'])->default('honed');
            $t->decimal('scale', 4, 2)->default(1);
            $t->decimal('rotation', 5, 2)->default(0);
            $t->decimal('roughness', 4, 3)->default(.6);
            $t->decimal('metalness', 4, 3)->default(0);
            $t->decimal('bump_strength', 4, 3)->default(.05);
            $t->enum('preset', ['studio', 'neutral'])->default('studio');
            $t->timestamps();
        });
        foreach (['product', 'application'] as $entity) {
            Schema::create($entity.'_media', function (Blueprint $t) use ($entity) {
                $t->id();
                $t->foreignId($entity.'_id')->constrained()->cascadeOnDelete();
                $t->foreignId('media_id')->constrained('media')->restrictOnDelete();
                $t->unsignedInteger('sort_order')->default(0);
                $t->unique([$entity.'_id', 'media_id']);
            });
        }
        Schema::create('site_settings', function (Blueprint $t) {
            $t->id();
            $t->string('brand_name')->default('TIME STONE');
            foreach (['logo_id', 'favicon_id'] as $col) {
                $t->foreignId($col)->nullable()->constrained('media')->restrictOnDelete();
            }
            $t->string('phone', 40)->nullable();
            $t->string('whatsapp', 30)->nullable();
            $t->string('email')->nullable();
            $t->string('address', 500)->nullable();
            $t->string('instagram')->nullable();
            $t->string('linkedin')->nullable();
            $t->boolean('contacts_visible')->default(false);
            $t->boolean('public_enabled')->default(false);
            $t->json('seo');
            $t->timestamps();
        });
        Schema::create('quotation_requests', function (Blueprint $t) {
            $t->id();
            $t->uuid('uuid')->unique();
            $t->string('reference', 40)->unique();
            $t->enum('locale', ['fr', 'en', 'ar'])->default('fr');
            $t->string('customer_name', 150);
            $t->string('email');
            $t->string('phone', 40)->nullable();
            $t->char('delivery_country', 2);
            $t->string('delivery_location', 300);
            $t->text('project_description');
            $t->timestamp('privacy_acknowledged_at');
            $t->timestamp('submitted_at');
            $t->enum('status', ['new', 'in_review', 'replied', 'closed'])->default('new');
            $t->text('internal_notes')->nullable();
            $t->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $t->timestamps();
            $t->index(['status', 'submitted_at', 'id']);
        });
        Schema::create('quotation_items', function (Blueprint $t) {
            $t->id();
            $t->foreignId('quotation_request_id')->constrained()->cascadeOnDelete();
            $t->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $t->json('product_snapshot');
            $t->json('finish_snapshot');
            $t->json('format_snapshot');
            $t->json('configuration_snapshot');
            foreach (['width', 'height', 'thickness'] as $d) {
                $t->decimal($d, 7, 2);
            }
            $t->decimal('quantity', 12, 3);
            $t->enum('unit', ['piece', 'm2', 'm3']);
            $t->boolean('custom_dimensions_requested')->default(false);
            $t->timestamps();
        });
        Schema::create('quotation_status_events', function (Blueprint $t) {
            $t->id();
            $t->foreignId('quotation_request_id')->constrained()->cascadeOnDelete();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->enum('from_status', ['new', 'in_review', 'replied', 'closed']);
            $t->enum('to_status', ['new', 'in_review', 'replied', 'closed']);
            $t->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        foreach (['quotation_status_events', 'quotation_items', 'quotation_requests', 'site_settings', 'application_media', 'product_media', 'product_3d_configs', 'product_formats', 'stone_type_media', 'stone_type_color', 'stone_type_finish', 'application_product', 'product_color', 'product_finish'] as $table) {
            Schema::dropIfExists($table);
        }
        foreach (['category', 'stone_type', 'finish', 'format', 'color', 'product', 'application', 'page', 'page_section', 'media'] as $entity) {
            Schema::dropIfExists($entity.'_translations');
        }
        foreach (['page_sections', 'pages', 'applications', 'products', 'colors', 'formats', 'finishes', 'stone_types', 'categories', 'media'] as $table) {
            Schema::dropIfExists($table);
        }
        Schema::table('users', fn (Blueprint $t) => $t->dropColumn(['role', 'active']));
    }
};
