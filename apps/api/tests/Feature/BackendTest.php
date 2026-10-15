<?php

namespace Tests\Feature;

use App\Domain\ContentWriter;
use App\Domain\MediaLibrary;
use App\Domain\QuotationWorkflow;
use App\Filament\Resources\ProductResource\CreateProduct;
use App\Filament\Resources\ProductResource\EditProduct;
use App\Models\Category;
use App\Models\Finish;
use App\Models\Format;
use App\Models\Media;
use App\Models\Page;
use App\Models\Product;
use App\Models\QuotationRequest;
use App\Models\SiteSetting;
use App\Models\StoneType;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Filament\Auth\Pages\Login;
use Filament\Facades\Filament;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class BackendTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        Storage::fake('local');
        SiteSetting::first()->update(['public_enabled' => true]);
        Filament::setCurrentPanel(Filament::getPanel('admin'));
        Filament::bootCurrentPanel();
    }

    private function admin(string $role = 'super_admin'): User
    {
        return User::factory()->create(['role' => $role, 'active' => true, 'password' => 'QA-only-password-2026']);
    }

    private function payload(): array
    {
        return ['slug' => 'qa-stone', 'sku' => null, 'category_id' => Category::where('slug', 'limestone')->value('id'), 'stone_type_id' => StoneType::where('slug', 'limestone')->value('id'), 'status' => 'draft', 'featured' => false, 'sort_order' => 0, 'illustrative' => true, 'viewer_enabled' => true, 'main_image_id' => null, 'texture_id' => $this->image()->id, 'og_image_id' => null,
            'translations' => ['fr' => ['name' => 'Pierre QA', 'description' => 'Illustration'], 'en' => ['name' => 'QA Stone'], 'ar' => ['name' => 'حجر تجريبي']],
            'finishes' => Finish::whereIn('slug', ['honed', 'brushed'])->pluck('id')->all(), 'colors' => [], 'applications' => [], 'gallery' => [],
            'format_options' => [['format_id' => Format::where('slug', 'slab')->value('id'), 'width' => 180, 'height' => 120, 'thickness' => 3, 'verified' => false, 'allow_custom' => true]],
            'configuration' => ['version' => 1, 'geometry' => 'slab', 'width' => 180, 'height' => 120, 'thickness' => 3, 'dimensions_verified' => false, 'finish' => 'honed', 'scale' => 1, 'rotation' => 0, 'roughness' => .6, 'metalness' => 0, 'bump_strength' => .05, 'preset' => 'studio']];
    }

    private function image(): Media
    {
        return app(MediaLibrary::class)->ingest(UploadedFile::fake()->image('safe.png', 64, 48));
    }

    public function test_guests_cannot_access_admin_and_registration_is_absent(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
        $this->get('/admin/products')->assertRedirect('/admin/login');
        $this->get('/register')->assertNotFound();
    }

    public function test_secure_cli_provisions_an_active_hashed_administrator(): void
    {
        $this->artisan('time-stone:admin', ['email' => 'provision@example.test', '--name' => 'QA Provision'])
            ->expectsQuestion('Password (minimum 14 characters)', 'QA-only-provision-password')
            ->expectsQuestion('Confirm password', 'QA-only-provision-password')
            ->assertExitCode(0);
        $user = User::where('email', 'provision@example.test')->firstOrFail();
        $this->assertTrue($user->active);
        $this->assertSame('super_admin', $user->role);
        $this->assertTrue(Hash::check('QA-only-provision-password', $user->password));
    }

    public function test_login_logout_and_password_hashing(): void
    {
        $user = $this->admin();
        $this->assertTrue(Hash::check('QA-only-password-2026', $user->password));
        Livewire::test(Login::class)->fillForm(['email' => $user->email, 'password' => 'QA-only-password-2026'])->call('authenticate')->assertHasNoFormErrors();
        $this->assertAuthenticatedAs($user);
        $this->post('/admin/logout')->assertRedirect();
        $this->assertGuest();
    }

    public function test_bad_credentials_and_inactive_accounts_are_denied(): void
    {
        $user = $this->admin();
        Livewire::test(Login::class)->fillForm(['email' => $user->email, 'password' => 'wrong'])->call('authenticate')->assertHasFormErrors(['email']);
        $this->assertGuest();
        $user->forceFill(['active' => false])->save();
        Livewire::test(Login::class)->fillForm(['email' => $user->email, 'password' => 'QA-only-password-2026'])->call('authenticate')->assertHasFormErrors(['email']);
        $this->assertGuest();
    }

    public function test_login_is_rate_limited(): void
    {
        $component = Livewire::test(Login::class)->fillForm(['email' => 'absent@example.test', 'password' => 'incorrect']);
        for ($i = 0; $i < 6; $i++) {
            $component->call('authenticate');
        }
        $component->assertNotified();
        $this->assertGuest();
    }

    public function test_content_manager_cannot_manage_settings_or_users_or_elevate_privileges(): void
    {
        $u = $this->admin('content_manager');
        $this->actingAs($u);
        $this->get('/admin/users')->assertForbidden();
        $this->get('/admin/site-settings')->assertForbidden();
        $this->assertFalse(Gate::allows('update', $u));
        try {
            app(ContentWriter::class)->save(User::class, ['role' => 'super_admin'], $u);
            $this->fail('Escalation accepted');
        } catch (AuthorizationException) {
        }
        $u->fill(['role' => 'super_admin'])->save();
        $this->assertSame('content_manager', $u->fresh()->role);
    }

    public function test_last_super_admin_cannot_be_disabled(): void
    {
        $u = $this->admin();
        $this->actingAs($u);
        $this->expectException(ValidationException::class);
        app(ContentWriter::class)->save(User::class, ['name' => $u->name, 'email' => $u->email, 'role' => 'content_manager', 'active' => false], $u);
    }

    public function test_inactive_administrator_cannot_write_products(): void
    {
        $user = $this->admin();
        $user->forceFill(['active' => false])->save();
        $this->actingAs($user);
        $this->get('/admin/products')->assertForbidden();
        $this->expectException(AuthorizationException::class);
        app(ContentWriter::class)->save(Product::class, $this->payload());
    }

    public function test_product_create_edit_publish_unpublish_and_delete(): void
    {
        $this->actingAs($this->admin());
        $writer = app(ContentWriter::class);
        $data = $this->payload();
        $p = $writer->save(Product::class, $data);
        $this->assertCount(3, $p->translations);
        $this->assertCount(2, $p->finishes);
        $this->assertCount(1, $p->formats);
        $data['translations']['fr']['name'] = 'Pierre modifiée';
        $data['status'] = 'published';
        $data['main_image_id'] = $this->image()->id;
        $data['texture_id'] = $data['main_image_id'];
        $writer->save(Product::class, $data, $p);
        $this->getJson('/api/v1/products/qa-stone?locale=ar')->assertOk()->assertJsonPath('data.name', 'حجر تجريبي')->assertJsonPath('data.saved_3d_configuration.version', 1)->assertJsonPath('data.uploaded_model', null);
        $data['status'] = 'draft';
        $writer->save(Product::class, $data, $p);
        $this->assertNull($p->fresh()->published_at);
        $p->delete();
        $this->assertDatabaseMissing('products', ['id' => $p->id]);
        $this->assertDatabaseMissing('product_3d_configs', ['product_id' => $p->id]);
    }

    public function test_filament_create_and_edit_product_forms_use_domain_validation(): void
    {
        $this->actingAs($this->admin());
        Livewire::test(CreateProduct::class)->fillForm($this->payload())->call('create')->assertHasNoFormErrors();
        $p = Product::where('slug', 'qa-stone')->firstOrFail();
        Livewire::test(EditProduct::class, ['record' => $p->id])->fillForm(['translations.fr.name' => 'Updated in Filament'])->call('save')->assertHasNoFormErrors();
        $this->assertSame('Updated in Filament', $p->fresh()->label());
    }

    public static function invalidConfigurations(): array
    {
        return [['width', 0], ['height', 501], ['thickness', -.5], ['scale', 5], ['rotation', 361], ['roughness', 2], ['version', 2], ['finish', 'brushed'], ['geometry', 'sphere']];
    }

    public function test_filament_product_uploads_are_assigned_before_publication(): void
    {
        $this->actingAs($this->admin());
        $data = $this->payload();
        $data['status'] = 'published';
        $data['main_upload'] = UploadedFile::fake()->image('main.png', 64, 48);
        $data['texture_upload'] = UploadedFile::fake()->image('texture.png', 64, 48);
        Livewire::test(CreateProduct::class)->fillForm($data)->call('create')->assertHasNoFormErrors();
        $product = Product::where('slug', 'qa-stone')->firstOrFail();
        $this->assertNotNull($product->main_image_id);
        $this->assertNotNull($product->texture_id);
        $editor = Livewire::test(EditProduct::class, ['record' => $product->id]);
        $editor->fillForm(['main_upload' => UploadedFile::fake()->image('changed.png', 80, 48)])->call('save')->assertHasNoFormErrors();
        $count = Media::count();
        $editor->call('save')->assertHasNoFormErrors();
        $this->assertSame($count, Media::count());
    }

    #[DataProvider('invalidConfigurations')]
    public function test_invalid_configuration_is_rejected(string $field, mixed $value): void
    {
        $this->actingAs($this->admin());
        $data = $this->payload();
        $data['configuration'][$field] = $value;
        $this->expectException(ValidationException::class);
        app(ContentWriter::class)->save(Product::class, $data);
    }

    public function test_translation_and_finish_format_mismatches_are_rejected(): void
    {
        $this->actingAs($this->admin());
        foreach (['missing_french', 'finish', 'format'] as $case) {
            $data = $this->payload();
            if ($case === 'missing_french') {
                $data['translations']['fr']['name'] = '';
            }
            if ($case === 'finish') {
                $data['configuration']['finish'] = 'polished';
            }
            if ($case === 'format') {
                $data['configuration']['geometry'] = 'block';
            }
            try {
                app(ContentWriter::class)->save(Product::class, $data);
                $this->fail('Invalid combination accepted');
            } catch (ValidationException) {
            }
        }
        $this->assertDatabaseCount('products', 0);
    }

    public function test_publish_without_images_rolls_back_all_tables(): void
    {
        $this->actingAs($this->admin());
        $data = $this->payload();
        $data['status'] = 'published';
        try {
            app(ContentWriter::class)->save(Product::class, $data);
            $this->fail('Empty media published');
        } catch (ValidationException) {
        }
        $this->assertDatabaseCount('products', 0);
        $this->assertDatabaseCount('product_translations', 0);
        $this->assertDatabaseCount('product_3d_configs', 0);
    }

    public function test_published_api_filters_pagination_sorting_and_french_fallback(): void
    {
        Product::factory()->create(['slug' => 'hidden-draft']);
        $p = Product::factory()->published()->create(['slug' => 'visible-stone', 'category_id' => Category::where('slug', 'limestone')->value('id'), 'stone_type_id' => StoneType::where('slug', 'limestone')->value('id')]);
        $p->finishes()->attach(Finish::where('slug', 'honed')->value('id'));
        Product::factory()->published()->create(['slug' => 'second-stone']);
        $this->getJson('/api/v1/products?locale=ar&category=limestone&stone_type=limestone&finish=honed&sort=name_desc&per_page=1')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.slug', 'visible-stone')->assertJsonPath('data.0.name', 'Étude de pierre')->assertJsonPath('meta.total', 1)->assertJsonPath('locale.fallback', 'fr');
        $this->getJson('/api/v1/products?per_page=1&page=2&sort=newest')->assertOk()->assertJsonPath('meta.total', 2)->assertJsonPath('meta.current_page', 2);
        $this->getJson('/api/v1/products/hidden-draft')->assertNotFound();
        $this->getJson('/api/v1/products/unknown')->assertNotFound();
        $this->getJson('/api/v1/products?q=not-found')->assertOk()->assertJsonCount(0, 'data');
    }

    public function test_invalid_api_parameters_are_rejected_and_writes_unavailable(): void
    {
        foreach (['locale=de', 'per_page=100', 'sort=sql', 'page=0', 'q[]=bad', 'category=../bad'] as $query) {
            $this->getJson('/api/v1/products?'.$query)->assertUnprocessable();
        }
        $this->postJson('/api/v1/products', [])->assertMethodNotAllowed();
        $this->postJson('/api/v1/quotation-requests', [])->assertNotFound();
        $this->getJson('/api/v1/quotation-requests')->assertNotFound();
    }

    public function test_public_master_visibility_and_inactive_parents_are_respected(): void
    {
        $p = Product::factory()->published()->create();
        $p->category->update(['active' => false]);
        $this->getJson('/api/v1/products')->assertOk()->assertJsonPath('meta.total', 0);
        SiteSetting::first()->update(['public_enabled' => false]);
        $this->getJson('/api/v1/products')->assertNotFound();
    }

    public function test_sensitive_fields_are_not_serialized_and_query_count_is_bounded(): void
    {
        Product::factory()->published()->count(8)->create();
        StoneType::first()->update(['internal_notes' => 'DO NOT EXPOSE']);
        DB::enableQueryLog();
        $response = $this->getJson('/api/v1/products?per_page=8')->assertOk();
        $queries = count(DB::getQueryLog());
        DB::disableQueryLog();
        $this->assertLessThan(30, $queries);
        $this->assertStringNotContainsString('internal_notes', $response->getContent());
        $this->getJson('/api/v1/materials')->assertOk()->assertDontSee('DO NOT EXPOSE');
        $this->getJson('/api/v1/site')->assertOk()->assertJsonPath('data.contacts', null)->assertDontSee('DB_PASSWORD');
    }

    public function test_images_have_safe_names_private_originals_and_no_upscaling(): void
    {
        $m = app(MediaLibrary::class)->ingest(UploadedFile::fake()->image('../../unsafe.png', 64, 48));
        $this->assertStringStartsWith('media/', $m->path);
        $this->assertStringNotContainsString('..', $m->path);
        $this->assertSame('local', $m->disk);
        $this->assertSame(64, $m->derivatives['preview']['width']);
        Storage::disk('local')->assertExists($m->path);
        $this->get('/media/'.$m->id.'/preview')->assertNotFound();
        $this->actingAs($this->admin())->get('/media/'.$m->id.'/thumb')->assertOk()->assertHeader('Content-Type', 'image/webp');
        $this->get('/media/'.$m->id.'/original')->assertNotFound();
    }

    public function test_svg_executable_glb_spoofed_and_oversized_uploads_are_rejected(): void
    {
        $files = [UploadedFile::fake()->createWithContent('evil.svg', '<svg onload="alert(1)"/>'), UploadedFile::fake()->createWithContent('evil.php', '<?php echo 1;'), UploadedFile::fake()->createWithContent('model.glb', 'glTF'.str_repeat('x', 20)), UploadedFile::fake()->createWithContent('fake.jpg', 'not an image'), UploadedFile::fake()->image('big.jpg')->size(10241)];
        foreach ($files as $file) {
            try {
                app(MediaLibrary::class)->ingest($file);
                $this->fail('Unsafe upload accepted');
            } catch (ValidationException) {
            }
        }
        $this->assertDatabaseCount('media', 0);
    }

    public function test_media_replacement_preserves_id_and_shared_deletion_is_blocked(): void
    {
        $this->actingAs($this->admin());
        $m = $this->image();
        $p = Product::factory()->create(['main_image_id' => $m->id]);
        $second = Product::factory()->create(['texture_id' => $m->id]);
        $updated = app(ContentWriter::class)->save(Media::class, ['purpose' => 'texture', 'upload' => UploadedFile::fake()->image('replacement.png', 80, 50), 'translations' => ['fr' => ['name' => 'Texture'], 'en' => ['name' => 'Texture'], 'ar' => ['name' => 'خامة']]], $m);
        $this->assertSame($m->id, $updated->id);
        $this->assertSame($m->id, $p->fresh()->main_image_id);
        $this->assertSame($m->id, $second->fresh()->texture_id);
        $this->assertSame(80, $updated->width);
        $this->expectException(ValidationException::class);
        app(MediaLibrary::class)->remove($updated);
    }

    public function test_quotation_snapshots_survive_product_deletion_and_status_is_audited(): void
    {
        $this->actingAs($this->admin('content_manager'));
        $product = Product::factory()->create();
        $quote = QuotationRequest::factory()->create();
        $item = $quote->items()->create(['product_id' => $product->id, 'product_snapshot' => ['name' => 'Original name'], 'finish_snapshot' => ['name' => 'Honed'], 'format_snapshot' => ['name' => 'Slab'], 'configuration_snapshot' => ['version' => 1, 'shape' => 'slab'], 'width' => 180, 'height' => 120, 'thickness' => 3, 'quantity' => 2, 'unit' => 'piece']);
        $product->delete();
        $this->assertNull($item->fresh()->product_id);
        $this->assertSame('Original name', $item->fresh()->product_snapshot['name']);
        app(QuotationWorkflow::class)->update($quote, ['status' => 'in_review', 'internal_notes' => 'PRIVATE REVIEW']);
        $this->assertDatabaseHas('quotation_status_events', ['quotation_request_id' => $quote->id, 'from_status' => 'new', 'to_status' => 'in_review', 'user_id' => auth()->id()]);
        $this->get('/admin/quotation-requests/'.$quote->id.'/edit')->assertOk()->assertSee('Original name')->assertSee('PRIVATE REVIEW');
        $this->expectException(ValidationException::class);
        $item->update(['product_snapshot' => ['name' => 'Tampered']]);
    }

    public function test_database_rejects_invalid_dimensions_without_the_form(): void
    {
        $product = Product::factory()->create();
        $this->expectException(QueryException::class);
        $product->configuration()->create(['width' => 501, 'height' => 120, 'thickness' => 3]);
    }

    public function test_page_application_settings_and_definition_forms_render(): void
    {
        $this->actingAs($this->admin());
        foreach (['categories', 'stone-types', 'finishes', 'formats', 'colors', 'applications', 'page-sections', 'media', 'users'] as $resource) {
            $this->get('/admin/'.$resource.'/create')->assertOk();
        }
        $this->get('/admin/site-settings/'.SiteSetting::first()->id.'/edit')->assertOk();
        $this->get('/admin/pages/'.Page::first()->id.'/edit')->assertOk();
        $this->get('/admin')->assertOk()->assertSee('TIME STONE');
    }
}
