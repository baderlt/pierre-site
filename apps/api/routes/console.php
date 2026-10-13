<?php

use App\Domain\MediaLibrary;
use App\Models\Page;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('time-stone:catalogue-banners', function () {
    $page = Page::where('slug', 'shared')->firstOrFail();
    foreach (['catalogue-hero' => 'catalogue-hero.webp', 'catalogue-cta' => 'hero-stone.webp'] as $key => $filename) {
        if ($page->sections()->where('key', $key)->exists()) {
            continue;
        }
        DB::transaction(function () use ($page, $key, $filename) {
            $file = new UploadedFile(base_path('../web/public/images/'.$filename), $filename, 'image/webp', null, true);
            $image = app(MediaLibrary::class)->ingest($file);
            $section = $page->sections()->create(['key' => $key, 'type' => 'hero', 'visible' => true, 'image_id' => $image->id, 'sort_order' => 100]);
            foreach (['fr' => 'Bannière catalogue', 'en' => 'Catalogue banner', 'ar' => 'صورة بانر الكتالوج'] as $locale => $name) {
                $section->translations()->create(['locale' => $locale, 'name' => $name.' · '.$key]);
            }
        });
        $this->info('Added '.$key.' using the existing illustrative image.');
    }
})->purpose('Add editable catalogue banners without replacing existing content');
