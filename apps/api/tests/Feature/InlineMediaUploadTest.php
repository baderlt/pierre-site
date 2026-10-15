<?php

namespace Tests\Feature;

use App\Filament\Resources\CategoryResource\CreateCategory;
use App\Filament\Resources\PageResource\EditPage;
use App\Models\Category;
use App\Models\Media;
use App\Models\Page;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Filament\Actions\Testing\TestAction;
use Filament\Facades\Filament;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;

class InlineMediaUploadTest extends TestCase
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
    }

    private function upload(): array
    {
        return ['upload' => UploadedFile::fake()->image('inline.jpg', 80, 60), 'translations' => ['fr' => ['name' => 'Pierre'], 'en' => ['name' => 'Stone'], 'ar' => ['name' => 'حجر']]];
    }

    public function test_category_upload_selects_image_and_preserves_unsaved_fields(): void
    {
        $form = Livewire::test(CreateCategory::class)->fillForm(['slug' => 'inline-category', 'translations.fr.name' => 'Nouvelle catégorie']);
        $form->callAction(TestAction::make('createOption')->schemaComponent('image_id'), $this->upload())->assertHasNoFormErrors();
        $media = Media::where('original_filename', 'inline.jpg')->sole();
        $form->assertSet('data.image_id', $media->id)->assertSet('data.slug', 'inline-category')->assertSet('data.translations.fr.name', 'Nouvelle catégorie');
        $this->assertSame('image/webp', mime_content_type(Storage::disk('local')->path($media->derivatives['preview']['path'])));
        $this->assertSame('حجر', $media->label('ar'));
        $this->get($media->url())->assertOk(); // Authorized administrators can inspect private previews.
        $form->call('create')->assertHasNoFormErrors();
        $this->assertSame($media->id, Category::where('slug', 'inline-category')->sole()->image_id);
        $this->get($media->url('original'))->assertNotFound();
        auth()->logout();
        $this->get($media->url('original'))->assertNotFound();
    }

    public function test_sharing_upload_is_assigned_only_when_page_is_saved(): void
    {
        $page = Page::where('slug', 'home')->firstOrFail();
        $original = $page->og_image_id;
        $form = Livewire::test(EditPage::class, ['record' => $page->id]);
        $form->callAction(TestAction::make('createOption')->schemaComponent('og_image_id'), $this->upload())->assertHasNoFormErrors();
        $media = Media::where('original_filename', 'inline.jpg')->sole();
        $form->assertSet('data.og_image_id', $media->id);
        $this->assertSame($original, $page->fresh()->og_image_id);
        $form->call('save')->assertHasNoFormErrors();
        $this->assertSame($media->id, $page->fresh()->og_image_id);
    }

    public function test_invalid_image_stays_in_modal_without_creating_media(): void
    {
        $count = Media::count();
        $data = $this->upload();
        $data['upload'] = UploadedFile::fake()->create('unsafe.svg', 2, 'image/svg+xml');
        Livewire::test(CreateCategory::class)->callAction(TestAction::make('createOption')->schemaComponent('image_id'), $data)->assertHasFormErrors(['upload']);
        $this->assertSame($count, Media::count());
    }

    public function test_upload_action_requires_current_media_create_permission(): void
    {
        Gate::before(fn ($user, $ability, $arguments) => $ability === 'create' && ($arguments[0] ?? null) === Media::class ? false : null);
        Livewire::test(CreateCategory::class)->assertActionHidden(TestAction::make('createOption')->schemaComponent('image_id'));
        $this->expectException(\Illuminate\Auth\Access\AuthorizationException::class);
        app(\App\Domain\ContentWriter::class)->save(Media::class, [...$this->upload(), 'purpose' => 'image']);
    }
}
