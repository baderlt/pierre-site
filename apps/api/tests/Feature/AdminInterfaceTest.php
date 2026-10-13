<?php

namespace Tests\Feature;

use App\Filament\Resources\ApplicationResource\EditApplication;
use App\Filament\Resources\CategoryResource\EditCategory;
use App\Filament\Resources\StoneTypeResource\EditStoneType;
use App\Models\Application;
use App\Models\Category;
use App\Models\Color;
use App\Models\Finish;
use App\Models\Product;
use App\Models\StoneType;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Filament\Facades\Filament;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class AdminInterfaceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        Filament::setCurrentPanel(Filament::getPanel('admin'));
        Filament::bootCurrentPanel();
    }

    private function signIn(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'super_admin', 'active' => true]));
    }

    private function product(): Product
    {
        $product = Product::create(['slug' => 'regression-stone', 'category_id' => Category::first()->id, 'stone_type_id' => StoneType::first()->id]);
        $product->translations()->create(['locale' => 'fr', 'name' => 'Pierre test']);

        return $product;
    }

    public function test_material_edit_preserves_owned_products_and_pivot_selections(): void
    {
        $this->signIn();
        $product = $this->product();
        $material = $product->stoneType;
        $finish = Finish::first()->id;
        $color = Color::first()->id;
        $material->finishes()->attach($finish);
        $material->colors()->attach($color);
        $this->get('/admin/stone-types/'.$material->id.'/edit')->assertOk();
        Livewire::test(EditStoneType::class, ['record' => $material->id])
            ->assertSet('data.finishes', [$finish])->assertSet('data.colors', [$color])
            ->fillForm(['translations.fr.name' => 'Matériau modifié'])->call('save')->assertHasNoFormErrors();
        $this->assertSame('Matériau modifié', $material->fresh()->label());
        $this->assertSame($material->id, $product->fresh()->stone_type_id);
        $this->assertSame([$finish], $material->finishes()->allRelatedIds()->all());
        $this->assertSame([$color], $material->colors()->allRelatedIds()->all());
    }

    public function test_category_edit_preserves_owned_products(): void
    {
        $this->signIn();
        $product = $this->product();
        $category = $product->category;
        $this->get('/admin/categories/'.$category->id.'/edit')->assertOk();
        Livewire::test(EditCategory::class, ['record' => $category->id])
            ->fillForm(['translations.fr.name' => 'Catégorie modifiée'])->call('save')->assertHasNoFormErrors();
        $this->assertSame('Catégorie modifiée', $category->fresh()->label());
        $this->assertSame($category->id, $product->fresh()->category_id);
    }

    public function test_application_edit_still_loads_and_preserves_related_products(): void
    {
        $this->signIn();
        $product = $this->product();
        $application = Application::create(['slug' => 'qa-application', 'status' => 'draft', 'sort_order' => 0, 'illustrative' => true]);
        $application->translations()->create(['locale' => 'fr', 'name' => 'Application test']);
        $application->products()->attach($product);
        Livewire::test(EditApplication::class, ['record' => $application->id])
            ->assertSet('data.products', [$product->id])->call('save')->assertHasNoFormErrors();
        $this->assertSame([$product->id], $application->products()->allRelatedIds()->all());
    }

    public static function languages(): array
    {
        return [['fr', 'ltr', 'Matériaux', 'Total des produits'], ['en', 'ltr', 'Materials', 'Total products'], ['ar', 'rtl', 'المواد', 'إجمالي المنتجات']];
    }

    #[DataProvider('languages')]
    public function test_admin_language_is_saved_and_current_page_is_preserved(string $locale, string $direction, string $materials, string $stat): void
    {
        $target = '/admin/stone-types/'.StoneType::first()->id.'/edit?tab=translations';
        $this->post('/admin/locale', ['locale' => $locale, 'return_to' => $target])
            ->assertRedirect($target)->assertSessionHas('admin_locale', $locale);
        $this->get('/admin/login')->assertOk()->assertSee('lang="'.$locale.'"', false)->assertSee('dir="'.$direction.'"', false);
        $this->signIn();
        $this->get('/admin')->assertOk()->assertSee($materials)->assertSee($stat)->assertSee('dir="'.$direction.'"', false);
        $this->get($target)->assertOk()->assertSee($materials);
        $this->get('/admin/products/create')->assertOk();
        $this->get('/admin/quotation-requests')->assertOk();
        $this->get('/admin/site-settings/1/edit')->assertOk();
    }

    public function test_french_is_default_and_invalid_stored_locale_falls_back_to_french(): void
    {
        $this->get('/admin/login')->assertOk()->assertSee('lang="fr"', false);
        $this->withSession(['admin_locale' => 'invalid'])->get('/admin/login')->assertOk()->assertSee('lang="fr"', false);
    }

    public static function invalidPreferences(): array
    {
        return [['de', '/admin'], ['ar', 'https://example.test/admin'], ['en', '//example.test/admin'], ['fr', '/administrator'], ['en', "/admin\r\nLocation: https://example.test"], ['ar', '/admin\\example.test']];
    }

    #[DataProvider('invalidPreferences')]
    public function test_language_switch_rejects_invalid_locales_and_redirect_destinations(string $locale, string $target): void
    {
        $this->withSession(['admin_locale' => 'fr'])->postJson('/admin/locale', ['locale' => $locale, 'return_to' => $target])
            ->assertUnprocessable()->assertSessionHas('admin_locale', 'fr');
    }

    public static function localeCodes(): array
    {
        return array_map(fn ($language) => [$language[0]], self::languages());
    }

    #[DataProvider('localeCodes')]
    public function test_required_validation_messages_follow_the_selected_language(string $locale): void
    {
        app()->setLocale($locale);
        $message = validator(['name' => ''], ['name' => 'required'])->errors()->first('name');
        $this->assertStringContainsString(match ($locale) {
            'fr' => 'obligatoire', 'ar' => 'مطلوب', default => 'required'
        }, $message);
    }
}
