<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\ApplicationResource;
use App\Filament\Resources\CategoryResource;
use App\Filament\Resources\PageResource;
use App\Filament\Resources\PageSectionResource;
use App\Filament\Resources\ProductResource;
use App\Filament\Resources\SiteSettingResource;
use App\Models\Application;
use App\Models\Category;
use App\Models\Media;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\Product;
use App\Models\SiteSetting;
use Filament\Widgets\Widget;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Gate;
use Livewire\WithPagination;

class WebsiteImages extends Widget
{
    use WithPagination;

    protected static bool $isDiscovered = false;
    protected static bool $isLazy = false;
    protected string $view = 'admin.website-images';
    protected int|string|array $columnSpan = 'full';
    public string $placement = 'home';

    public static function canView(): bool
    {
        return Gate::allows('viewAny', Media::class);
    }

    public function updatedPlacement(): void
    {
        $this->resetPage('imagePlacements');
    }

    private function card(Model $record, ?Media $image, string $resource, string $role, ?string $title = null): array
    {
        return [
            'title' => $title ?? ($record->label(app()->getLocale()) ?: ($record->slug ?? $record->key)),
            'role' => $role,
            'image' => $image?->url('thumb'),
            'filename' => $image?->original_filename,
            'edit' => Gate::allows('update', $record) ? $resource::getUrl('edit', ['record' => $record]) : null,
            'state' => isset($record->status) ? __(ucfirst($record->status)) : ((($record->visible ?? $record->active) === false) ? __('Hidden') : null),
        ];
    }

    protected function getViewData(): array
    {
        Gate::authorize('viewAny', Media::class);
        $pages = Page::with('translations')->orderBy('id')->get();
        $options = $pages->mapWithKeys(fn ($page) => [$page->slug => ($page->label(app()->getLocale()) ?: $page->slug).' /'.$page->slug])->all();
        $options += ['_products' => __('Products'), '_categories' => __('Categories'), '_applications' => __('Applications')];
        abort_unless(array_key_exists($this->placement, $options), 404);
        $groups = [];
        $pagination = null;
        $page = $pages->firstWhere('slug', $this->placement);
        if ($page) {
            $sections = PageSection::with(['translations', 'image'])->where('page_id', $page->id)->where(fn ($q) => $q->whereNotNull('image_id')->orWhereIn('type', ['hero', 'image_text']))->orderBy('sort_order')->orderBy('id')->get();
            $groups[__('Page images')] = $sections->map(fn ($section) => $this->card($section, $section->image, PageSectionResource::class, $section->key.' · '.__($section->type)))->all();
            $page->load('ogImage');
            $groups[__('Open Graph image')] = [$this->card($page, $page->ogImage, PageResource::class, __('Open Graph image'))];
        }
        if (in_array($this->placement, ['home', '_categories'], true)) {
            $query = Category::with(['translations', 'image'])->orderBy('sort_order')->orderBy('id');
            $records = $this->placement === 'home' ? $query->where('active', true)->limit(6)->get() : ($pagination = $query->paginate(12, pageName: 'imagePlacements'));
            $groups[__('Categories')] = $records->map(fn ($record) => $this->card($record, $record->image, CategoryResource::class, __('Categories')))->all();
        }
        if (in_array($this->placement, ['home', '_products'], true)) {
            $query = Product::with(['translations', 'mainImage'])->orderBy('sort_order')->orderBy('id');
            $records = $this->placement === 'home' ? $query->publicCatalogue()->where('featured', true)->limit(6)->get() : ($pagination = $query->paginate(12, pageName: 'imagePlacements'));
            $groups[__($this->placement === 'home' ? 'Featured products' : 'Products')] = $records->map(fn ($record) => $this->card($record, $record->mainImage, ProductResource::class, __('Main image')))->all();
        }
        if (in_array($this->placement, ['applications', '_applications'], true)) {
            $records = $pagination = Application::with(['translations', 'image'])->orderBy('sort_order')->orderBy('id')->paginate(12, pageName: 'imagePlacements');
            $groups[__('Applications')] = $records->map(fn ($record) => $this->card($record, $record->image, ApplicationResource::class, __('Image')))->all();
        }
        if ($this->placement === 'shared' && Gate::allows('viewAny', SiteSetting::class)) {
            $settings = SiteSetting::first();
            if ($settings) {
                $media = Media::whereIn('id', array_filter([$settings->logo_id, $settings->favicon_id]))->get()->keyBy('id');
                $groups[__('Brand & contact')] = collect(['logo_id' => 'Logo', 'favicon_id' => 'Favicon'])->map(fn ($role, $field) => $this->card($settings, $media->get($settings->$field), SiteSettingResource::class, __($role), $settings->brand_name))->values()->all();
            }
        }
        $path = $page && in_array($page->slug, ['home', 'about', 'applications', 'contact', 'quote'], true) && $page->status === 'published' && $page->published_at?->lte(now()) && SiteSetting::where('public_enabled', true)->exists() ? ($page->slug === 'home' ? '' : '/'.$page->slug) : null;
        $publicUrl = $path !== null ? rtrim(config('integration.website_origin'), '/').'/'.app()->getLocale().$path : null;
        return compact('options', 'groups', 'pagination', 'publicUrl');
    }
}
