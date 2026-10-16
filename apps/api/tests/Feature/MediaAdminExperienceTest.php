<?php

namespace Tests\Feature;

use App\Domain\MediaLibrary;
use App\Filament\Resources\CategoryResource;
use App\Filament\Resources\CategoryResource\ListCategory;
use App\Filament\Resources\MediaResource\ListMedia;
use App\Filament\Resources\PageSectionResource;
use App\Filament\Resources\ProductResource;
use App\Filament\Resources\ProductResource\ListProduct;
use App\Filament\Widgets\WebsiteImages;
use App\Models\Category;
use App\Models\Page;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Filament\Actions\Testing\TestAction;
use Filament\Facades\Filament;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;

class MediaAdminExperienceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        Storage::fake('local');
        Filament::setCurrentPanel(Filament::getPanel('admin'));
        Filament::bootCurrentPanel();
        $this->actingAs(User::factory()->create(['role' => 'content_manager', 'active' => true]));
        app()->setLocale('fr');
    }

    public function test_product_and_category_lists_show_eager_loaded_thumbnails(): void
    {
        $media = app(MediaLibrary::class)->ingest(UploadedFile::fake()->image('list.jpg', 80, 60));
        $product = Product::factory()->create(['main_image_id' => $media->id]);
        $category = Category::firstOrFail();
        $category->update(['image_id' => $media->id]);
        Livewire::test(ListProduct::class)->assertTableColumnStateSet('image_preview', $media->url('thumb'), $product);
        Livewire::test(ListCategory::class)->assertTableColumnStateSet('image_preview', $media->url('thumb'), $category);
        $products = ProductResource::getEloquentQuery()->get();
        $categories = CategoryResource::getEloquentQuery()->get();
        DB::enableQueryLog();
        foreach ($products as $record) $record->mainImage;
        foreach ($categories as $record) $record->image;
        $this->assertCount(0, DB::getQueryLog());
        DB::disableQueryLog();
    }

    public function test_visual_map_scopes_sections_and_never_links_to_unpublished_pages(): void
    {
        $home = Page::where('slug', 'home')->firstOrFail();
        $about = Page::where('slug', 'about')->firstOrFail();
        $hero = $home->sections()->create(['key' => 'qa-home-hero', 'type' => 'hero', 'visible' => true, 'sort_order' => 0]);
        $about->sections()->create(['key' => 'qa-about-hero', 'type' => 'hero', 'visible' => false, 'sort_order' => 0]);
        $widget = Livewire::test(WebsiteImages::class)->assertSee('qa-home-hero')->assertDontSee('qa-about-hero')->assertSee(PageSectionResource::getUrl('edit', ['record' => $hero]), false)->assertDontSee('Voir la page du site');
        $widget->set('placement', 'about')->assertSee('qa-about-hero')->assertDontSee('qa-home-hero');
        $home->update(['status' => 'published', 'published_at' => now()]);
        SiteSetting::first()->update(['public_enabled' => true]);
        Livewire::test(WebsiteImages::class)->assertSee('Voir la page du site');
        Livewire::test(ListMedia::class)->assertSee('Vue des images du site');
    }

    public function test_map_translations_and_paginated_catalogue_are_available(): void
    {
        Product::factory()->count(13)->create();
        foreach (['fr' => 'Vue des images du site', 'en' => 'Website image map', 'ar' => 'عرض صور الموقع'] as $locale => $heading) {
            app()->setLocale($locale);
            Livewire::test(WebsiteImages::class)->set('placement', '_products')->assertSee($heading)->assertSee('imagePlacements');
        }
        Livewire::test(WebsiteImages::class)->set('placement', '_categories')->assertSee(Category::first()->label(app()->getLocale()));
    }

    public function test_usage_reports_all_content_roles_and_scopes_settings_permission(): void
    {
        $media = app(MediaLibrary::class)->ingest(UploadedFile::fake()->image('shared.jpg', 80, 60));
        $product = Product::factory()->create(['main_image_id' => $media->id, 'texture_id' => $media->id]);
        $product->gallery()->attach($media->id);
        $category = Category::firstOrFail();
        $category->update(['image_id' => $media->id]);
        $page = Page::where('slug', 'home')->firstOrFail();
        $page->update(['og_image_id' => $media->id]);
        $page->sections()->create(['key' => 'shared-hero', 'type' => 'hero', 'image_id' => $media->id]);
        SiteSetting::first()->update(['logo_id' => $media->id]);
        $locations = app(MediaLibrary::class)->locations($media);
        $this->assertCount(4, $locations);
        $this->assertStringContainsString('shared-hero', implode(' ', array_column($locations, 'name')));
        $this->assertCount(1, array_filter($locations, fn ($location) => $location['edit'] === ProductResource::getUrl('edit', ['record' => $product])));
        $this->assertStringContainsString(__('Gallery images'), implode(' ', array_column($locations, 'roles')));
        $this->actingAs(User::factory()->create(['role' => 'super_admin', 'active' => true]));
        $this->assertCount(5, app(MediaLibrary::class)->locations($media));
        Livewire::test(ListMedia::class)->mountAction(TestAction::make('usage')->table($media))->assertSee('shared-hero');
    }

    public function test_widget_and_usage_require_admin_authorization_and_do_not_publish_media(): void
    {
        $media = app(MediaLibrary::class)->ingest(UploadedFile::fake()->image('private.jpg', 80, 60));
        auth()->logout();
        Livewire::test(WebsiteImages::class)->assertForbidden();
        $this->get($media->url('thumb'))->assertNotFound();
        $this->expectException(\Illuminate\Auth\Access\AuthorizationException::class);
        app(MediaLibrary::class)->locations($media);
    }

    public function test_invalid_map_selection_cannot_access_another_data_source(): void
    {
        Livewire::test(WebsiteImages::class)->set('placement', '../../private')->assertNotFound();
    }
}
