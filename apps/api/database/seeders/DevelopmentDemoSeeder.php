<?php

namespace Database\Seeders;

use App\Domain\MediaLibrary;
use App\Models\Application;
use App\Models\Category;
use App\Models\Color;
use App\Models\Finish;
use App\Models\Format;
use App\Models\Media;
use App\Models\Page;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\StoneType;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class DevelopmentDemoSeeder extends Seeder
{
    private array $images = [];

    private function image(?string $key): ?int
    {
        if (! $key) {
            return null;
        }
        if (isset($this->images[$key])) {
            return $this->images[$key];
        }
        $file = dirname(base_path(), 2).'/apps/web/public/images/'.$key.'.webp';
        if (! is_file($file)) {
            return null;
        }
        $existing = Media::where('original_filename', $key.'.webp')->first();
        $media = $existing ?? app(MediaLibrary::class)->ingest(new UploadedFile($file, $key.'.webp', 'image/webp', null, true), str_contains($key, 'texture') ? 'texture' : 'image');
        foreach (['fr' => 'Illustration temporaire', 'en' => 'Temporary illustration', 'ar' => 'صورة توضيحية مؤقتة'] as $locale => $name) {
            $media->translations()->firstOrCreate(['locale' => $locale], ['name' => $name]);
        }

        return $this->images[$key] = $media->id;
    }

    public function run(): void
    {
        if (! app()->environment(['local', 'testing'])) {
            throw new \RuntimeException('Illustrative seed data is restricted to local/testing.');
        }
        $this->call(DatabaseSeeder::class);
        $fixtures = json_decode(file_get_contents(database_path('fixtures/milestone-4-content.json')), true, 512, JSON_THROW_ON_ERROR);
        DB::transaction(function () use ($fixtures) {
            foreach ($fixtures['fr']['applications'] as $i => $item) {
                $application = Application::updateOrCreate(['slug' => $item['slug']], ['status' => 'published', 'published_at' => now(), 'illustrative' => true, 'sort_order' => $i, 'image_id' => $this->image($item['image'])]);
                foreach (['fr', 'en', 'ar'] as $locale) {
                    $copy = $fixtures[$locale]['applications'][$i];
                    $application->translations()->updateOrCreate(['locale' => $locale], ['name' => $copy['title'], 'description' => $copy['description']."\n\n".implode("\n", $copy['considerations'])]);
                }
                $gallery = [];
                foreach ($item['gallery'] as $n => $image) {
                    if ($id = $this->image($image)) {
                        $gallery[$id] = ['sort_order' => $n];
                    }
                }
                $application->gallery()->sync($gallery);
            }
            foreach ($fixtures['fr']['products'] as $i => $item) {
                $product = Product::updateOrCreate(['slug' => $item['id']], ['category_id' => Category::where('slug', $item['category'])->value('id'), 'stone_type_id' => StoneType::where('slug', $item['stone_type'])->value('id'), 'status' => 'published', 'published_at' => now(), 'illustrative' => true, 'featured' => $i < 3, 'sort_order' => $i, 'main_image_id' => $this->image($item['image']), 'texture_id' => $this->image($item['stone_type'] === 'marble' ? 'product-marble-texture' : 'product-beige-texture')]);
                foreach (['fr', 'en', 'ar'] as $locale) {
                    $product->translations()->updateOrCreate(['locale' => $locale], ['name' => $fixtures[$locale]['products'][$i]['name'], 'description' => $fixtures[$locale]['home']['demo']]);
                }
                // Explicit illustrative combinations; brushed is commercial-only, never a simulated finish.
                $finishKeys = array_unique([$item['finish'], 'honed', 'polished', 'rough']);
                $product->finishes()->sync(Finish::whereIn('slug', $finishKeys)->pluck('id'));
                $product->colors()->sync(Color::where('slug', $item['color'])->pluck('id'));
                $applicationKey = $item['application'] === 'exterior' ? 'exterior-facades' : $item['application'];
                $product->applications()->sync(Application::where('slug', $applicationKey)->pluck('id'));
                $geometry = $item['category'] === 'blocks' ? 'block' : ($item['category'] === 'tiles' ? 'tile' : 'slab');
                $dims = match ($geometry) {
                    'block' => ['width' => 100, 'height' => 80, 'thickness' => 60],'tile' => ['width' => 60, 'height' => 60, 'thickness' => 1.5],default => ['width' => 180, 'height' => 120, 'thickness' => 3]
                };
                $product->formats()->sync([Format::where('geometry', $geometry)->value('id') => [...$dims, 'verified' => false, 'allow_custom' => true]]);
                $product->configuration()->updateOrCreate([], ['version' => 1, 'geometry' => $geometry, ...$dims, 'dimensions_verified' => false, 'finish' => 'honed', 'scale' => 1, 'rotation' => 0, 'roughness' => .6, 'metalness' => 0, 'bump_strength' => .05, 'preset' => 'studio']);
            }
            foreach (['home', 'about', 'applications', 'contact', 'quote', 'shared'] as $key) {
                $page = Page::where('slug', $key)->firstOrFail();
                $page->update(['status' => 'published', 'published_at' => now()]);
                foreach (['fr', 'en', 'ar'] as $locale) {
                    $h = $fixtures[$locale]['home'];
                    $c = $fixtures[$locale]['public'];
                    $title = match ($key) {
                        'home' => $h['meta']['title'],'about' => $c['aboutTitle'],'applications' => $c['applicationsTitle'],'contact' => $c['contactPageTitle'],'quote' => $c['enquiry'],default => 'TIME STONE'
                    };
                    $intro = match ($key) {
                        'home' => $h['hero']['description'],'about' => $c['aboutIntro'],'applications' => $c['applicationsIntro'],'contact' => $c['contactPageIntro'],'quote' => $c['demoText'],default => $h['footer']['note']
                    };
                    $page->translations()->updateOrCreate(['locale' => $locale], ['name' => str_replace("\n", ' ', $title), 'description' => $intro, 'seo_title' => str_replace("\n", ' ', $title), 'seo_description' => $intro]);
                }
                $groups = match ($key) {
                    'home' => ['hero', 'collection', 'quarry', 'introduction', 'featured', 'craft', 'applications', 'quality', 'contact'],'about' => ['hero', 'story', 'material', 'process', 'quality', 'cta'],'applications' => ['hero', 'gallery', 'cta'],'contact' => ['hero', 'enquiry'],'quote' => ['hero'],'shared' => ['navigation', 'footer', 'cta']
                };
                foreach ($groups as $sort => $group) {
                    $type = in_array($group, ['hero', 'story', 'quality', 'cta', 'navigation', 'footer']) ? $group : 'image_text';
                    $image = match ($group) {
                        'hero' => $key === 'about' ? 'about-hero' : ($key === 'home' ? 'hero-quarry' : null),'quarry' => 'about-hero','material' => 'product-beige-texture',default => null
                    };
                    $section = $page->sections()->updateOrCreate(['key' => $group], ['type' => $type, 'visible' => true, 'sort_order' => $sort, 'image_id' => $this->image($image), 'link_path' => $group === 'cta' || $group === 'contact' || $group === 'enquiry' ? '/fr/quote' : null]);
                    foreach (['fr', 'en', 'ar'] as $locale) {
                        $h = $fixtures[$locale]['home'];
                        $c = $fixtures[$locale]['public'];
                        $about = $fixtures[$locale]['about'];
                        if ($key === 'home') {
                            $copy = $h[$group];
                            $name = $copy['title'] ?? $copy['eyebrow'] ?? 'TIME STONE';
                            $body = $copy['description'] ?? '';
                            $cta = $copy['action'] ?? $h['quote'];
                        } else {
                            $name = match ($group) {
                                'hero' => $page->label($locale),'story' => $c['companyTitle'],'material' => $about['material']['title'],'process' => $c['processTitle'],'quality' => $c['qualityTitles'][0],'gallery' => $c['galleryTitle'],'navigation' => $h['footer']['navigation'],'footer' => 'TIME STONE',default => $c['contactTitle']
                            };
                            $body = match ($group) {
                                'hero' => $page->label($locale, 'description'),'story' => $c['companyText']."\n".$c['companyDraft'],'material' => $about['material']['text'],'process' => $c['processIntro']."\n".implode("\n", $c['processTexts']),'quality' => implode("\n", $c['qualityTexts'])."\n".$c['qualityNote'],'gallery' => $c['galleryIntro'],'navigation' => implode("\n", $h['nav']),'footer' => $h['footer']['tagline']."\n".$h['footer']['note'],default => $c['contactIntro']
                            };
                            $cta = $c['contactAction'];
                        }
                        $section->translations()->updateOrCreate(['locale' => $locale], ['name' => str_replace("\n", ' ', $name), 'description' => $body, 'cta_label' => $cta]);
                    }
                }
            }
            SiteSetting::first()->update(['public_enabled' => true]);
        });
    }
}
