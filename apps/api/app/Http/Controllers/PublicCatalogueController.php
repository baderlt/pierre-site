<?php

namespace App\Http\Controllers;

use App\Http\Requests\CatalogueRequest;
use App\Http\Resources\ProductResource;
use App\Models\Application;
use App\Models\Category;
use App\Models\Color;
use App\Models\Finish;
use App\Models\Format;
use App\Models\Page;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\StoneType;
use Illuminate\Support\Facades\Cache;

class PublicCatalogueController extends Controller
{
    public const CARD_RELATIONS = ['translations', 'category:id,slug', 'stoneType:id,slug', 'finishes:id,slug,active,simulation', 'colors:id,slug,active', 'applications:id,slug,status,published_at,illustrative', 'mainImage:id', 'mainImage.translations', 'ogImage:id'];

    public const PRODUCT_RELATIONS = ['translations', 'category.translations', 'stoneType.translations', 'finishes.translations', 'colors.translations', 'applications', 'mainImage.translations', 'texture.translations', 'ogImage', 'gallery.translations', 'formats.translations', 'configuration.modelMedia', 'configuration.topMedia', 'configuration.bottomMedia', 'configuration.sideMedia'];

    private function response(CatalogueRequest $request, callable $build)
    {
        abort_unless(SiteSetting::where('public_enabled', true)->exists(), 404);
        $query = $request->validated();
        ksort($query);
        $key = 'api:'.app()->environment().':'.Cache::get('public-content-version', 'initial').':'.hash('sha256', $request->getSchemeAndHttpHost().$request->path().json_encode($query));
        $payload = Cache::get($key);
        $cacheHit = $payload !== null;
        if ($payload === null) {
            $payload = Cache::lock($key.':fill', 10)->block(5, fn () => Cache::remember($key, 300, fn () => [...$build(), 'locale' => ['requested' => $request->input('locale', 'fr'), 'fallback' => 'fr']]));
        }

        // Revalidate at the application cache boundary; no stale reverse-proxy publication state.
        $response = response()->json($payload)->header('Cache-Control', 'public, max-age=0, must-revalidate')->header('ETag', '"'.hash('sha256', json_encode($payload)).'"');
        if ($request->attributes->get('integration.diagnostics')) {
            $response->headers->set('X-Content-Cache', $cacheHit ? 'hit' : 'miss');
        }

        return $response;
    }

    public function products(CatalogueRequest $request)
    {
        return $this->response($request, function () use ($request) {
            $q = $this->productQuery($request);
            $page = $q->paginate($request->integer('per_page', 12))->withQueryString();

            return ['data' => ProductResource::collection($page)->resolve($request), 'meta' => ['current_page' => $page->currentPage(), 'last_page' => $page->lastPage(), 'per_page' => $page->perPage(), 'total' => $page->total()], 'links' => ['prev' => $page->previousPageUrl(), 'next' => $page->nextPageUrl()], 'categories' => Category::where('active', true)->withCount(['products' => fn ($q) => $q->publicCatalogue()])->orderBy('sort_order')->get()->pluck('products_count', 'slug')->all()];
        });
    }

    private function productQuery(CatalogueRequest $request)
    {
        $q = Product::publicCatalogue()->with(self::CARD_RELATIONS);
        foreach (['category' => 'category', 'stone_type' => 'stoneType', 'finish' => 'finishes', 'color' => 'colors', 'application' => 'applications'] as $key => $relation) {
            if ($value = $request->input($key)) {
                $q->whereHas($relation, function ($q) use ($value, $key) {
                    $q->where('slug', $key === 'application' && $value === 'exterior' ? 'exterior-facades' : $value);
                    if ($key === 'application') {
                        $q->published();
                    } else {
                        $q->where('active', true);
                    }
                });
            }
        }
        if ($search = $request->input('q')) {
            $q->whereHas('translations', fn ($q) => $q->whereIn('locale', [$request->input('locale', 'fr'), 'fr'])->where(fn ($q) => $q->where('name', 'like', '%'.addcslashes($search, '%_\\').'%')->orWhere('description', 'like', '%'.addcslashes($search, '%_\\').'%')));
        }
        $sort = $request->input('sort', 'featured');
        if (in_array($sort, ['name_asc', 'name_desc'])) {
            $locale = $request->input('locale', 'fr');
            $q->leftJoin('product_translations as local_title', fn ($join) => $join->on('products.id', '=', 'local_title.product_id')->where('local_title.locale', $locale))->leftJoin('product_translations as fallback_title', fn ($join) => $join->on('products.id', '=', 'fallback_title.product_id')->where('fallback_title.locale', 'fr'))->select('products.*')->orderByRaw('COALESCE(local_title.name, fallback_title.name) '.($sort === 'name_asc' ? 'ASC' : 'DESC'));
        } elseif ($sort === 'newest') {
            $q->orderByDesc('published_at');
        } else {
            $q->orderByDesc('featured')->orderBy('sort_order');
        }

        return $q->orderBy('products.id');
    }

    public function product(CatalogueRequest $request, string $slug)
    {
        return $this->response($request, fn () => ['data' => (new ProductResource(Product::publicCatalogue()->with(self::PRODUCT_RELATIONS)->where('slug', $slug)->firstOrFail()))->resolve($request)]);
    }

    /** Bounded, publication-checked sitemap data; never includes demo products or PII. */
    public function seo(CatalogueRequest $request)
    {
        return $this->response($request, function () use ($request) {
            $products = Product::publicCatalogue()->where('illustrative', false)->with('translations')->orderBy('id')->paginate(48, ['id', 'slug'], 'page', $request->integer('page', 1));
            $applications = Application::published()->where('illustrative', false)->with('translations')->orderBy('id')->paginate(48, ['id', 'slug'], 'page', $request->integer('page', 1));
            $entries = collect();
            if ($request->integer('page', 1) === 1) {
                foreach (Page::published()->whereIn('slug', ['home', 'about', 'applications', 'contact'])->with(['translations', 'sections' => fn ($q) => $q->where('visible', true), 'sections.translations'])->get() as $page) {
                    $entries->push(['path' => $page->slug === 'home' ? '' : $page->slug, 'locales' => $this->pageLocales($page)]);
                }
                $entries->push(['path' => 'products', 'locales' => ['fr', 'en', 'ar']]);
            }
            foreach (['products' => $products, 'applications' => $applications] as $path => $records) {
                foreach ($records as $record) {
                    $entries->push(['path' => $path.'/'.$record->slug, 'locales' => $record->seoLocales()]);
                }
            }

            return ['data' => $entries->all(), 'meta' => ['last_page' => max($products->lastPage(), $applications->lastPage())]];
        });
    }

    private function pageLocales(Page $page): array
    {
        $locales = $page->seoLocales();
        foreach ($page->sections as $section) {
            $locales = array_values(array_intersect($locales, $section->seoLocales()));
        }

        return $locales;
    }

    public function definitions(CatalogueRequest $request, string $type)
    {
        $class = match ($type) {
            'categories' => Category::class,'materials' => StoneType::class,'finishes' => Finish::class,'formats' => Format::class,'colors' => Color::class
        };

        return $this->response($request, function () use ($request, $class) {
            $q = $class::where('active', true)->with(['translations', 'image'])->orderBy('sort_order');
            if ($class === StoneType::class) {
                $q->with(['colors', 'finishes', 'media']);
            }

            return ['data' => $q->get()->map(function ($m) use ($request) {
                $data = ['image' => $m->image?->url(), 'id' => (string) $m->id, 'slug' => $m->slug, 'name' => $m->label($request->input('locale', 'fr')), 'description' => $m->label($request->input('locale', 'fr'), 'description')];
                if ($m instanceof Finish) {
                    $data['simulation'] = $m->simulation;
                }
                if ($m instanceof Format) {
                    $data['geometry'] = $m->geometry;
                }
                if ($m instanceof StoneType) {
                    $data += ['classification' => $m->classification, 'colors' => $m->colors->where('active', true)->pluck('slug')->values()->all(), 'finishes' => $m->finishes->where('active', true)->pluck('slug')->values()->all(), 'textures' => $m->media->where('processing_status', 'ready')->map(fn ($media) => $media->url('texture'))->values()->all()];
                }

                return $data;
            })->all()];
        });
    }

    private function applicationData(Application $a, string $locale): array
    {
        return ['available_locales' => $a->seoLocales(), 'id' => (string) $a->id, 'slug' => $a->slug, 'title' => $a->label($locale), 'description' => $a->label($locale, 'description'), 'image' => $a->image?->url(), 'gallery' => $a->gallery->map(fn ($m, $index) => $index === 0 ? $m->bannerUrl() : $m->url())->all(), 'temporary' => $a->illustrative, 'seo' => ['title' => $a->label($locale, 'seo_title'), 'description' => $a->label($locale, 'seo_description')]];
    }

    public function applications(CatalogueRequest $request)
    {
        return $this->response($request, function () use ($request) {
            $page = Application::published()->with(['translations', 'image', 'gallery'])->orderBy('sort_order')->orderBy('id')->paginate($request->integer('per_page', 12))->withQueryString();

            return ['data' => $page->getCollection()->map(fn ($a) => $this->applicationData($a, $request->input('locale', 'fr')))->all(), 'meta' => ['current_page' => $page->currentPage(), 'last_page' => $page->lastPage(), 'per_page' => $page->perPage(), 'total' => $page->total()], 'links' => ['prev' => $page->previousPageUrl(), 'next' => $page->nextPageUrl()]];
        });
    }

    public function application(CatalogueRequest $request, string $slug)
    {
        return $this->response($request, function () use ($request, $slug) {
            $a = Application::published()->with(['translations', 'image', 'gallery'])->where('slug', $slug)->firstOrFail();
            $products = $a->products()->publicCatalogue()->with(self::CARD_RELATIONS)->orderBy('sort_order')->paginate($request->integer('per_page', 12))->withQueryString();

            return ['data' => $this->applicationData($a, $request->input('locale', 'fr')), 'products' => ['data' => ProductResource::collection($products)->resolve($request), 'meta' => ['current_page' => $products->currentPage(), 'last_page' => $products->lastPage(), 'per_page' => $products->perPage(), 'total' => $products->total()]]];
        });
    }

    public function page(CatalogueRequest $request, string $key)
    {
        return $this->response($request, function () use ($request, $key) {
            $p = Page::published()->with(['translations', 'ogImage', 'sections' => fn ($q) => $q->where('visible', true), 'sections.translations', 'sections.image'])->where('slug', $key)->firstOrFail();
            $locale = $request->input('locale', 'fr');

            return ['data' => ['available_locales' => $this->pageLocales($p), 'key' => $p->slug, 'title' => $p->label($locale), 'description' => $p->label($locale, 'description'), 'seo' => ['title' => $p->label($locale, 'seo_title'), 'description' => $p->label($locale, 'seo_description'), 'image' => $p->ogImage?->url()], 'sections' => $p->sections->map(fn ($s) => ['key' => $s->key, 'type' => $s->type, 'title' => $s->label($locale), 'body' => $s->label($locale, 'description'), 'cta_label' => $s->label($locale, 'cta_label'), 'link_path' => $s->link_path ? preg_replace('~^/(fr|en|ar)(?=/|$)~', '/'.$locale, $s->link_path) : null, 'image' => $s->image?->bannerUrl()])->all()]];
        });
    }

    public function site(CatalogueRequest $request)
    {
        return $this->response($request, function () use ($request) {
            $s = SiteSetting::with(['logo', 'favicon'])->firstOrFail();
            $locale = $request->input('locale', 'fr');
            $contacts = $s->contacts_visible ? $s->only(['phone', 'whatsapp', 'email', 'address', 'instagram', 'linkedin']) : null;
            if ($contacts !== null) {
                $contacts['maps_directions_url'] = filled($s->address) && \App\Rules\GoogleMapsLocation::accepts($s->maps_directions_url) ? $s->maps_directions_url : null;
            }

            return ['data' => ['brand_name' => $s->brand_name, 'logo' => $s->logo?->url(), 'favicon' => $s->favicon?->url('thumb'), 'contacts' => $contacts, 'seo' => $s->seo[$locale] ?? $s->seo['fr'] ?? null]];
        });
    }
}
