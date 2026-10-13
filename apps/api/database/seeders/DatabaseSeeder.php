<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Color;
use App\Models\Finish;
use App\Models\Format;
use App\Models\Page;
use App\Models\SiteSetting;
use App\Models\StoneType;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $definitions = [
            Category::class => ['limestone' => ['Calcaire', 'Limestone', 'الحجر الجيري'], 'marble' => ['Marbre', 'Marble', 'الرخام'], 'tiles' => ['Carreaux', 'Tiles', 'البلاط'], 'blocks' => ['Blocs', 'Blocks', 'الكتل'], 'custom' => ['Sur mesure', 'Custom', 'حسب الطلب']],
            StoneType::class => ['limestone' => ['Calcaire', 'Limestone', 'الحجر الجيري'], 'marble' => ['Marbre', 'Marble', 'الرخام']],
            Finish::class => ['honed' => ['Adouci', 'Honed', 'مصقول مطفي'], 'polished' => ['Poli', 'Polished', 'مصقول لامع'], 'rough' => ['Brut', 'Rough', 'خشن'], 'brushed' => ['Brossé', 'Brushed', 'ملمس مفروش']],
            Format::class => ['slab' => ['Tranche', 'Slab', 'لوح'], 'tile' => ['Carreau', 'Tile', 'بلاطة'], 'block' => ['Bloc', 'Block', 'كتلة']],
            Color::class => ['beige' => ['Beige', 'Beige', 'بيج'], 'grey' => ['Gris', 'Grey', 'رمادي'], 'white' => ['Blanc', 'White', 'أبيض']],
        ];
        foreach ($definitions as $class => $items) {
            foreach ($items as $slug => $names) {
                $attributes = ['sort_order' => array_search($slug, array_keys($items))];
                if ($class === Finish::class) {
                    $attributes['simulation'] = $slug === 'brushed' ? null : $slug;
                }
                if ($class === Format::class) {
                    $attributes['geometry'] = $slug;
                }
                $model = $class::firstOrCreate(['slug' => $slug], $attributes);
                foreach (array_combine(['fr', 'en', 'ar'], $names) as $locale => $name) {
                    $model->translations()->firstOrCreate(['locale' => $locale], ['name' => $name]);
                }
            }
        }
        foreach (['home', 'about', 'applications', 'contact', 'quote', 'shared'] as $slug) {
            $page = Page::firstOrCreate(['slug' => $slug], ['status' => 'draft']);
            $page->translations()->firstOrCreate(['locale' => 'fr'], ['name' => ucfirst($slug)]);
        }
        SiteSetting::firstOrCreate(['id' => 1], ['brand_name' => 'TIME STONE', 'seo' => ['fr' => ['title' => 'TIME STONE', 'description' => null], 'en' => ['title' => 'TIME STONE', 'description' => null], 'ar' => ['title' => 'TIME STONE', 'description' => null]], 'public_enabled' => false, 'contacts_visible' => false]);
    }
}
