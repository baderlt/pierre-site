<?php

namespace Tests\Feature;

use App\Domain\ContentWriter;
use App\Domain\MediaLibrary;
use App\Domain\ViewerConfiguration;
use App\Models\{Category,Finish,Format,Product,SiteSetting,StoneType,User};
use Filament\Facades\Filament;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use App\Models\QuotationRequest;
use Illuminate\Validation\ValidationException;
use Tests\Fixtures\GlbFactory;
use Tests\TestCase;

class ProductViewerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();$this->seed();Storage::fake('local');SiteSetting::first()->update(['public_enabled'=>true]);
        Filament::setCurrentPanel(Filament::getPanel('admin'));Filament::bootCurrentPanel();
        $this->actingAs(User::factory()->create(['active'=>true,'role'=>'super_admin']));
    }

    private function data(): array
    {
        $image=app(MediaLibrary::class)->ingest(UploadedFile::fake()->image('stone.png',64,64));
        return ['slug'=>'qa-optional','category_id'=>Category::where('slug','limestone')->value('id'),'stone_type_id'=>StoneType::where('slug','limestone')->value('id'),'status'=>'published','sort_order'=>0,'illustrative'=>true,'featured'=>false,'main_image_id'=>$image->id,'finishes'=>Finish::where('slug','honed')->pluck('id')->all(),'colors'=>[],'applications'=>[],'gallery'=>[],
            'translations'=>['fr'=>['name'=>'Pierre QA'],'en'=>['name'=>'QA stone'],'ar'=>['name'=>'حجر الاختبار']],
            'format_options'=>[['format_id'=>Format::where('slug','slab')->value('id'),'width'=>180,'height'=>120,'thickness'=>3,'verified'=>false,'allow_custom'=>true]]];
    }

    private function config(): array
    {
        return ['version'=>1,'geometry'=>'slab','width'=>180,'height'=>120,'thickness'=>3,'dimensions_verified'=>false,'finish'=>'honed','scale'=>1,'rotation'=>0,'roughness'=>.6,'metalness'=>0,'bump_strength'=>.05,'preset'=>'studio','source'=>'procedural','shape'=>'circle','shape_parameters'=>['diameter'=>120,'thickness'=>3],'parameter_limits'=>['diameter'=>['min'=>60,'max'=>180,'default'=>120,'step'=>10]],'customer_dimensions'=>true,'model_approved'=>false,'edge_finish'=>'rough'];
    }

    public function test_new_product_publishes_without_any_3d_or_texture(): void
    {
        $p=app(ContentWriter::class)->save(Product::class,$this->data());$this->assertFalse($p->viewer_enabled);$this->assertNull($p->configuration);$this->assertNull($p->texture_id);
        $this->getJson('/api/v1/products/'.$p->slug)->assertOk()->assertJsonPath('data.viewer_available',false)->assertJsonPath('data.viewer',null)->assertJsonPath('data.uploaded_model',null);
        $this->assertFalse(Product::factory()->create()->fresh()->viewer_enabled);
    }

    public function test_enable_disable_and_reenable_preserves_saved_configuration(): void
    {
        $data=$this->data();$p=app(ContentWriter::class)->save(Product::class,$data);
        $data+=['viewer_enabled'=>true,'texture_id'=>$p->main_image_id,'configuration'=>$this->config()];
        $p=app(ContentWriter::class)->save(Product::class,$data,$p);$saved=$p->configuration->toArray();
        $v=app(ViewerConfiguration::class)->public($p);$this->assertSame('circle',$v['shape']);$this->assertSame(120.0,$v['parameters']['diameter']);
        $data['viewer_enabled']=false;$p=app(ContentWriter::class)->save(Product::class,$data,$p);$this->assertSame($saved,$p->configuration->toArray());$this->assertNull(app(ViewerConfiguration::class)->public($p));
        $data['viewer_enabled']=true;$p=app(ContentWriter::class)->save(Product::class,$data,$p);$this->assertNotNull(app(ViewerConfiguration::class)->public($p));
        $this->assertSame($saved['id'],$p->configuration->id);
    }

    public function test_incomplete_enabled_configuration_is_rejected_without_partial_publication(): void
    {
        $data=$this->data();$data['viewer_enabled']=true;$data['configuration']=$this->config();
        try {app(ContentWriter::class)->save(Product::class,$data);$this->fail('Missing 3D texture accepted');} catch(ValidationException){$this->assertDatabaseMissing('products',['slug'=>$data['slug']]);}
    }

    public function test_malformed_admin_geometry_inputs_fail_validation_without_writes(): void
    {
        $base=$this->data();$base+=['viewer_enabled'=>true,'texture_id'=>$base['main_image_id']];
        foreach (['configuration','shape','shape_parameters','parameter_limits','dimension_limits','vertices'] as $case) {
            $data=$base;$data['configuration']=$this->config();
            if($case==='configuration')$data['configuration']='invalid';
            elseif($case==='vertices')$data['configuration']['shape_parameters']['vertices']='invalid';
            else $data['configuration'][$case]=$case==='shape'?['invalid']:'invalid';
            try {app(ContentWriter::class)->save(Product::class,$data);$this->fail('Malformed input accepted: '.$case);}catch(ValidationException){$this->assertDatabaseMissing('products',['slug'=>$base['slug']]);}
        }
    }

    public function test_custom_model_is_private_until_approved_and_enabled_and_keeps_its_materials(): void
    {
        $data=$this->data();$data+=['viewer_enabled'=>true,'model_upload'=>UploadedFile::fake()->createWithContent('two-materials.glb',GlbFactory::make()),'configuration'=>[...$this->config(),'source'=>'glb','shape'=>null,'shape_parameters'=>null,'customer_dimensions'=>false,'model_approved'=>true]];
        $p=app(ContentWriter::class)->save(Product::class,$data);$m=$p->configuration->modelMedia;$this->assertSame('model',$m->asset_type);$this->assertSame(2,$m->derivatives['model']['materials']);
        $snapshot=app(ViewerConfiguration::class)->selection($p,['version'=>2,'revision'=>(int)$p->configuration->revision,'source'=>'glb','shape'=>'model','parameters'=>[]]);$this->assertSame([],$snapshot['material_media_ids']);$this->assertSame($m->derivatives['model']['sha256'],$snapshot['model_sha256']);
        $this->assertTrue(Storage::disk('local')->exists($m->path));$this->get('/media/'.$m->id.'/original')->assertNotFound();
        auth()->logout();$this->get('/media/'.$m->id.'/model')->assertOk()->assertHeader('Content-Type','model/gltf-binary')->assertHeader('Cache-Control','no-store, private');
        $p->update(['viewer_enabled'=>false]);$this->get('/media/'.$m->id.'/model')->assertNotFound();$this->getJson('/api/v1/products/'.$p->slug)->assertJsonPath('data.uploaded_model',null)->assertJsonPath('data.viewer',null);
        $p->update(['viewer_enabled'=>true,'status'=>'draft']);$this->get('/media/'.$m->id.'/model')->assertNotFound();$this->assertTrue(Storage::disk('local')->exists($m->path));
    }

    public function test_unauthorized_upload_and_unapproved_model_are_rejected(): void
    {
        $data=$this->data();$data+=['viewer_enabled'=>true,'model_upload'=>UploadedFile::fake()->createWithContent('unsafe.glb','not a GLB'),'configuration'=>[...$this->config(),'source'=>'glb','customer_dimensions'=>false,'model_approved'=>true]];
        try {app(ContentWriter::class)->save(Product::class,$data);$this->fail('Malformed GLB accepted');} catch(ValidationException){$this->assertDatabaseMissing('products',['slug'=>$data['slug']]);}
        $data['model_upload']=UploadedFile::fake()->createWithContent('safe.glb',GlbFactory::make());$data['configuration']['model_approved']=false;
        try {app(ContentWriter::class)->save(Product::class,$data);$this->fail('Unapproved model accepted');} catch(ValidationException){$this->assertDatabaseMissing('products',['slug'=>$data['slug']]);}
    }

    public function test_approved_geometry_limits_and_immutable_selection_data(): void
    {
        $data=$this->data();$data+=['viewer_enabled'=>true,'texture_id'=>$data['main_image_id'],'configuration'=>$this->config()];$p=app(ContentWriter::class)->save(Product::class,$data);$v=app(ViewerConfiguration::class)->public($p);
        $selection=['version'=>2,'revision'=>$v['revision'],'source'=>'procedural','shape'=>'circle','parameters'=>['diameter'=>130,'thickness'=>3]];
        $snapshot=app(ViewerConfiguration::class)->selection($p,$selection);$this->assertSame(130.0,$snapshot['dimensions_cm']['width']);$this->assertSame('rough',$snapshot['edge_finish']);
        $selection['parameters']['diameter']=135;$this->expectException(ValidationException::class);app(ViewerConfiguration::class)->selection($p,$selection);
    }

    private function quote(Product $p,array $geometry): array
    {
        return ['locale'=>'fr','customer'=>['name'=>'QA ONLY geometry','email'=>'qa-geometry@example.test','phone'=>null],'delivery'=>['country_code'=>'MA','location'=>'Isolated fixture'],'project_details'=>'Synthetic geometry quotation','privacy_acknowledged'=>true,'website'=>'','challenge'=>Crypt::encryptString(json_encode(['issued'=>time()-5,'nonce'=>'geometry-test'])),
            'items'=>[['product_id'=>(string)$p->id,'format_id'=>(string)$p->formats->first()->id,'finish_id'=>(string)$p->finishes->first()->id,'dimensions_cm'=>['width'=>'130','height'=>'130','thickness'=>'3'],'quantity'=>'2','unit'=>'piece','custom_dimensions_requested'=>true,'geometry'=>$geometry]]];
    }

    public function test_quote_snapshots_geometry_and_retries_survive_later_configuration_changes(): void
    {
        $data=$this->data();$data+=['viewer_enabled'=>true,'texture_id'=>$data['main_image_id'],'configuration'=>$this->config()];$p=app(ContentWriter::class)->save(Product::class,$data);$v=app(ViewerConfiguration::class)->public($p);
        $geometry=['version'=>2,'revision'=>$v['revision'],'source'=>'procedural','shape'=>'circle','parameters'=>['diameter'=>130,'thickness'=>3]];$payload=$this->quote($p,$geometry);$key=(string)Str::uuid();
        $r=$this->withHeader('Idempotency-Key',$key)->postJson('/api/v1/quotations',$payload)->assertCreated();$item=QuotationRequest::first()->items->first();$snapshot=$item->configuration_snapshot;
        $this->assertSame(130,$snapshot['geometry_selection']['parameters']['diameter']);$this->assertSame('circle',$snapshot['geometry_selection']['shape']);$this->assertTrue(app(MediaLibrary::class)->referenced($p->texture));
        $data['configuration']['shape_parameters']['diameter']=140;$data['configuration']['parameter_limits']['diameter']['default']=140;$p=app(ContentWriter::class)->save(Product::class,$data,$p);
        $this->withHeader('Idempotency-Key',$key)->postJson('/api/v1/quotations',$payload)->assertOk()->assertJsonPath('reference',$r->json('reference'))->assertJsonPath('duplicate',true);
        $this->assertSame($snapshot,$item->fresh()->configuration_snapshot);
        $this->withHeader('Idempotency-Key',(string)Str::uuid())->postJson('/api/v1/quotations',$payload)->assertUnprocessable()->assertJsonValidationErrors('items.0.geometry');
        $payload['items'][0]['geometry']['revision']=(int)$p->configuration->revision;$payload['items'][0]['geometry']['parameters']['diameter']=135;
        $this->withHeader('Idempotency-Key',(string)Str::uuid())->postJson('/api/v1/quotations',$payload)->assertUnprocessable();
        $p->update(['viewer_enabled'=>false]);$payload['items'][0]['geometry']['parameters']['diameter']=130;
        $this->withHeader('Idempotency-Key',(string)Str::uuid())->postJson('/api/v1/quotations',$payload)->assertUnprocessable();$this->assertDatabaseCount('quotation_requests',1);
    }

    public function test_disabled_product_quote_needs_no_geometry_and_missing_or_forged_models_fail(): void
    {
        $p=app(ContentWriter::class)->save(Product::class,$this->data());$payload=$this->quote($p,[]);unset($payload['items'][0]['geometry']);$payload['items'][0]['dimensions_cm']['width']='180';$payload['items'][0]['dimensions_cm']['height']='120';$payload['items'][0]['custom_dimensions_requested']=false;
        $this->withHeader('Idempotency-Key',(string)Str::uuid())->postJson('/api/v1/quotations',$payload)->assertCreated();$this->assertNull(QuotationRequest::first()->items->first()->configuration_snapshot['geometry_selection']);
        $data=$this->data();$data['slug']='missing-model';$data+=['viewer_enabled'=>true,'configuration'=>[...$this->config(),'source'=>'glb','customer_dimensions'=>false,'model_approved'=>true,'model_media_id'=>$p->main_image_id]];
        $this->expectException(ValidationException::class);app(ContentWriter::class)->save(Product::class,$data);
    }
}
