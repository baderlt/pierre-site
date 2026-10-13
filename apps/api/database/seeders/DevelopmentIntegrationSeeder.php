<?php

namespace Database\Seeders;

use App\Domain\MediaLibrary;
use App\Models\Category;
use App\Models\Media;
use App\Models\Page;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

/** Add missing approved M4 illustrative sections without replacing editorial text. */
class DevelopmentIntegrationSeeder extends Seeder
{
    private function image(string $key): int
    {
        $existing = Media::where('original_filename', $key.'.webp')->first();
        if ($existing) {
            return $existing->id;
        }
        $path = dirname(base_path(), 2).'/apps/web/public/images/'.$key.'.webp';

        return app(MediaLibrary::class)->ingest(new UploadedFile($path, $key.'.webp', 'image/webp', null, true), 'image')->id;
    }

    public function run(): void
    {
        if (! app()->environment(['local', 'testing'])) {
            throw new \RuntimeException('Development fixtures only.');
        }
        $fixtures = json_decode(file_get_contents(database_path('fixtures/milestone-4-content.json')), true, 512, JSON_THROW_ON_ERROR);
        DB::transaction(function () use ($fixtures) {
            foreach (['home' => ['hero' => 'hero-stone', 'quarry' => 'quarry', 'introduction' => 'architecture'], 'about' => ['hero' => 'about-hero', 'story' => 'architecture', 'material' => 'about-hero'], 'applications' => ['hero' => 'applications-hero'], 'contact' => ['hero' => 'applications-hero'], 'quote' => ['hero' => 'about-hero']] as $key => $images) {
                $page = Page::where('slug', $key)->firstOrFail();
                foreach ($images as $section => $image) {
                    $s = $page->sections()->where('key', $section)->first();
                    if ($s && (! $s->image_id || ($key === 'home' && $section === 'hero' && Media::find($s->image_id)?->original_filename === 'hero-quarry.webp'))) {
                        $s->update(['image_id' => $this->image($image)]);
                    }
                }
            }
            foreach (['limestone', 'marble', 'tiles', 'blocks', 'custom'] as $slug) {
                $category = Category::where('slug', $slug)->first();
                if ($category && ! $category->image_id) {
                    $category->update(['image_id' => $this->image($slug)]);
                }
            }
            foreach (['home', 'about'] as $pageKey) {
                $hero = Page::where('slug', $pageKey)->first()->sections()->where('key', 'hero')->first();
                foreach (['fr', 'en', 'ar'] as $locale) {
                    $desired = $pageKey === 'home' ? $fixtures[$locale]['home']['hero']['title'] : $fixtures[$locale]['public']['aboutTitle'];
                    $t = $hero->translations()->where('locale', $locale)->first();
                    if ($t && $t->name === str_replace("\n", ' ', $desired)) {
                        $t->update(['name' => $desired]);
                    }
                }
            }
            $requestCopy = ['fr' => ["Donnons forme\nà votre projet", 'Rassemblez votre sélection et les informations utiles pour préparer un devis.'], 'en' => ["Let’s shape\nyour project", 'Gather your selection and the details needed to prepare a quotation.'], 'ar' => ["لنصغ\nفكرة مشروعك", 'اجمع اختيارك والتفاصيل اللازمة للتحضير لعرض السعر.']];
            foreach (['fr', 'en', 'ar'] as $locale) {
                $page = Page::where('slug', 'quote')->first();
                $hero = $page->sections()->where('key', 'hero')->first();
                $t = $hero->translations()->where('locale', $locale)->first();
                if ($t && $t->name === $fixtures[$locale]['public']['enquiry']) {
                    $t->update(['name' => $requestCopy[$locale][0]]);
                }
                if ($t && $t->description === $fixtures[$locale]['public']['demoText']) {
                    $t->update(['description' => $requestCopy[$locale][1]]);
                }
                $pt = $page->translations()->where('locale', $locale)->first();
                if ($pt && $pt->description === $fixtures[$locale]['public']['demoText']) {
                    $pt->update(['description' => $requestCopy[$locale][1], 'seo_description' => $requestCopy[$locale][1]]);
                }
            }
            foreach (['home', 'about'] as $key) {
                $page = Page::where('slug', $key)->firstOrFail();
                $items = [];
                if ($key === 'home') {
                    foreach ($fixtures['fr']['home']['qualities'] as $i => $v) {
                        $items['quality-item-'.$i] = fn ($l) => ['name' => $fixtures[$l]['home']['qualities'][$i]['title'], 'description' => $fixtures[$l]['home']['qualities'][$i]['description']];
                    }
                    foreach ($fixtures['fr']['home']['craft']['steps'] as $i => $v) {
                        $items['craft-step-'.$i] = fn ($l) => ['name' => $fixtures[$l]['home']['craft']['steps'][$i]];
                    }
                    foreach ($fixtures['fr']['home']['quality']['points'] as $i => $v) {
                        $items['quality-point-'.$i] = fn ($l) => ['name' => $fixtures[$l]['home']['quality']['points'][$i]];
                    }
                } else {
                    foreach ($fixtures['fr']['public']['qualityTitles'] as $i => $v) {
                        $items['value-'.$i] = fn ($l) => ['name' => $fixtures[$l]['public']['qualityTitles'][$i], 'description' => $fixtures[$l]['public']['qualityTexts'][$i]];
                    }
                    foreach ($fixtures['fr']['about']['stages'] as $i => $v) {
                        $items['stage-'.$i] = fn ($l) => ['name' => $fixtures[$l]['about']['stages'][$i]['title'], 'description' => $fixtures[$l]['about']['stages'][$i]['text']];
                    }
                }
                foreach ($items as $name => $copy) {
                    $section = $page->sections()->firstOrCreate(['key' => $name], ['type' => 'image_text', 'visible' => true, 'sort_order' => 100 + count($items), 'image_id' => str_starts_with($name, 'stage-') ? $this->image($fixtures['fr']['about']['stages'][(int) substr($name, 6)]['image']) : null]);
                    foreach (['fr', 'en', 'ar'] as $l) {
                        $section->translations()->firstOrCreate(['locale' => $l], $copy($l));
                    }
                }
            }
        });
    }
}
