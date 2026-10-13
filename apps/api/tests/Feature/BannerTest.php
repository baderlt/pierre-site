<?php

namespace Tests\Feature;

use App\Domain\MediaLibrary;
use App\Filament\Resources\PageSectionResource\EditPageSection;
use App\Models\Application;
use App\Models\Media;
use App\Models\Page;
use App\Models\SiteSetting;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Filament\Facades\Filament;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;

class BannerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        Storage::fake('local');
        Filament::setCurrentPanel(Filament::getPanel('admin'));
        Filament::bootCurrentPanel();
    }

    public function test_high_resolution_banner_is_bounded_and_private_until_published(): void
    {
        $image = app(MediaLibrary::class)->ingest(UploadedFile::fake()->image('banner.jpg', 3000, 900));
        $this->assertSame(2560, $image->derivatives['banner']['width']);
        $this->assertSame(1200, $image->derivatives['preview']['width']);
        $this->assertSame(192, $image->derivatives['swatch']['width']);
        $this->assertSame(960, $image->derivatives['large']['width']);
        $this->assertSame(640, $image->derivatives['card']['width']);
        $this->assertSame(192, $image->derivatives['card']['height']);
        $this->get($image->bannerUrl())->assertNotFound();
        $this->get($image->url('card'))->assertNotFound();
        $page = Page::where('slug', 'home')->firstOrFail();
        $section = $page->sections()->create(['key' => 'hero', 'type' => 'hero', 'visible' => true, 'image_id' => $image->id]);
        $section->translations()->create(['locale' => 'fr', 'name' => 'Bannière test']);
        SiteSetting::first()->update(['public_enabled' => true]);
        $page->update(['status' => 'published', 'published_at' => now()]);
        $this->getJson('/api/v1/pages/home?locale=ar')->assertOk()->assertJsonPath('data.sections.0.image', $image->bannerUrl());
        $this->get($image->bannerUrl())->assertOk()->assertHeader('Content-Type', 'image/webp');
        $this->get($image->url('card'))->assertOk()->assertHeader('Content-Type', 'image/webp');
        $derivatives = $image->derivatives;
        unset($derivatives['card']);
        $image->update(['derivatives' => $derivatives]);
        $this->get($image->url('card'))->assertOk(); // Older libraries retain a safe larger fallback.
        $application = Application::create(['slug' => 'banner-application', 'status' => 'published', 'published_at' => now(), 'illustrative' => true]);
        $application->gallery()->attach($image->id, ['sort_order' => 0]);
        $this->getJson('/api/v1/applications/banner-application?locale=en')->assertOk()->assertJsonPath('data.gallery.0', $image->bannerUrl());
        $application->gallery()->detach();
        $this->get($image->url('original'))->assertNotFound();
        $section->update(['visible' => false]);
        $this->get($image->bannerUrl())->assertNotFound();
        $this->get($image->url('card'))->assertNotFound();
    }

    public function test_banner_upload_from_section_form_preserves_other_image_references(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'super_admin', 'active' => true]));
        $original = app(MediaLibrary::class)->ingest(UploadedFile::fake()->image('original.jpg', 64, 48));
        $page = Page::where('slug', 'home')->firstOrFail();
        $section = $page->sections()->create(['key' => 'hero', 'type' => 'hero', 'visible' => true, 'image_id' => $original->id, 'sort_order' => 0]);
        $section->translations()->create(['locale' => 'fr', 'name' => 'Bannière test']);
        $other = $page->sections()->create(['key' => 'other', 'type' => 'hero', 'visible' => true, 'image_id' => $original->id]);
        Livewire::test(EditPageSection::class, ['record' => $section->id])->fillForm(['image_upload' => UploadedFile::fake()->image('replacement.jpg', 64, 48)])->call('save')->assertHasNoFormErrors();
        $this->assertNotSame($original->id, $section->fresh()->image_id);
        $this->assertSame($original->id, $other->fresh()->image_id);
        $this->assertSame(64, $section->fresh()->image->derivatives['banner']['width']);
        $this->assertSame(64, $section->fresh()->image->derivatives['card']['width']);
        $count = Media::count();
        Livewire::test(EditPageSection::class, ['record' => $section->id])->call('save')->assertHasNoFormErrors();
        $this->assertSame($count, Media::count());
        $this->get('/admin/page-sections?filters[banners][isActive]=1')->assertOk()->assertSee('Bannière test');
    }

    public function test_existing_media_uses_its_largest_available_safe_variant(): void
    {
        $image = new Media(['derivatives' => ['texture' => ['width' => 2048]]]);
        $this->assertStringEndsWith('/texture', $image->bannerUrl());
        $image->derivatives = ['preview' => ['width' => 1200]];
        $this->assertStringEndsWith('/preview', $image->bannerUrl());
    }
}
