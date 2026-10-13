<?php

namespace Tests\Feature;

use App\Domain\ContentWriter;
use App\Domain\MediaLibrary;
use App\Models\Application;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PublishingTest extends TestCase
{
    use DatabaseMigrations;

    public function test_committed_updates_invalidate_cached_api_and_draft_media_is_private(): void
    {
        $this->seed();
        Storage::fake('local');
        SiteSetting::first()->update(['public_enabled' => true]);
        $product = Product::factory()->published()->create();
        $this->getJson('/api/v1/products/'.$product->slug)->assertOk()->assertJsonPath('data.name', 'Étude de pierre');
        $product->translations()->where('locale', 'fr')->first()->update(['name' => 'Published change']);
        $this->getJson('/api/v1/products/'.$product->slug)->assertOk()->assertJsonPath('data.name', 'Published change');
        $media = app(MediaLibrary::class)->ingest(UploadedFile::fake()->image('public.png', 50, 50));
        $product->update(['main_image_id' => $media->id]);
        $this->get('/media/'.$media->id.'/preview')->assertOk();
        $product->update(['status' => 'draft', 'published_at' => null]);
        $this->getJson('/api/v1/products/'.$product->slug)->assertNotFound();
        $this->get('/media/'.$media->id.'/preview')->assertNotFound();
    }

    public function test_structured_content_application_and_contact_management(): void
    {
        $this->seed();
        $this->actingAs(User::factory()->create(['active' => true, 'role' => 'content_manager']));
        $writer = app(ContentWriter::class);
        $translations = ['fr' => ['name' => 'Titre français', 'description' => 'Texte illustratif'], 'en' => ['name' => 'English title'], 'ar' => ['name' => 'عنوان عربي']];
        $application = $writer->save(Application::class, ['slug' => 'qa-application', 'status' => 'draft', 'illustrative' => true, 'sort_order' => 0, 'image_id' => null, 'translations' => $translations, 'products' => [], 'gallery' => []]);
        $this->assertSame('عنوان عربي', $application->label('ar'));
        $page = Page::where('slug', 'home')->firstOrFail();
        $section = $writer->save(PageSection::class, ['page_id' => $page->id, 'key' => 'qa-hero', 'type' => 'hero', 'visible' => true, 'sort_order' => 0, 'image_id' => null, 'link_path' => '/fr/quote', 'translations' => $translations]);
        $this->assertSame('hero', $section->type);
        $this->actingAs(User::factory()->create(['active' => true, 'role' => 'super_admin']));
        $site = SiteSetting::first();
        $values = $site->only($site->getFillable());
        $values['phone'] = '+212 600 000 000';
        $values['contacts_visible'] = false;
        $writer->save(SiteSetting::class, $values, $site);
        $this->assertSame('+212 600 000 000', $site->fresh()->phone);
        $site->update(['public_enabled' => true]);
        $this->getJson('/api/v1/site')->assertOk()->assertJsonPath('data.contacts', null);
        $this->getJson('/api/v1/pages/home')->assertNotFound();
        $this->getJson('/api/v1/applications/qa-application')->assertNotFound();
        $page->update(['status' => 'published', 'published_at' => now()]);
        $this->getJson('/api/v1/pages/home?locale=en')->assertOk()->assertJsonPath('data.sections.0.title', 'English title')->assertJsonPath('data.sections.0.link_path', '/en/quote');
        $section->update(['visible' => false]);
        $this->getJson('/api/v1/pages/home?locale=en')->assertOk()->assertJsonCount(0, 'data.sections');
        $application->update(['status' => 'published', 'published_at' => now()]);
        $application->products()->attach([Product::factory()->published()->create()->id, Product::factory()->create()->id]);
        $this->getJson('/api/v1/applications/qa-application?locale=en&per_page=1')->assertOk()->assertJsonPath('data.title', 'English title')->assertJsonPath('products.meta.total', 1);
    }
}
