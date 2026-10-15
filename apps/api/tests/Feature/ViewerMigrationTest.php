<?php

namespace Tests\Feature;

use App\Models\{Product,Format,Media};
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ViewerMigrationTest extends TestCase
{
    use DatabaseMigrations;

    public function test_migration_preserves_existing_available_viewers_and_defaults_new_products_off(): void
    {
        $this->seed();$this->artisan('migrate:rollback',['--step'=>1])->assertSuccessful();
        $m=new Media(['original_filename'=>'legacy.webp','disk'=>'local','path'=>'legacy/original.webp','mime'=>'image/webp','bytes'=>100,'width'=>10,'height'=>10,'purpose'=>'texture','processing_status'=>'ready','derivatives'=>[],'uploaded_at'=>now()]);unset($m->asset_type);$m->save(); // Reproduce a row from the actual pre-feature schema.
        $p=Product::factory()->published()->create(['texture_id'=>$m->id]);$p->configuration()->create(['geometry'=>'slab','width'=>180,'height'=>120,'thickness'=>3]);$p->formats()->attach(Format::where('slug','slab')->value('id'),['width'=>180,'height'=>120,'thickness'=>3,'verified'=>false,'allow_custom'=>true]);
        $off=Product::factory()->published()->create();$before=DB::table('products')->where('id',$p->id)->first();
        $this->artisan('migrate')->assertSuccessful();$after=(array)DB::table('products')->where('id',$p->id)->first();unset($after['viewer_enabled']);
        $this->assertSame((array)$before,$after);$this->assertTrue($p->fresh()->viewer_enabled);$this->assertTrue($p->fresh()->configuration->customer_dimensions);$this->assertFalse($off->fresh()->viewer_enabled);$this->assertFalse(Product::factory()->create()->fresh()->viewer_enabled);
    }
}
