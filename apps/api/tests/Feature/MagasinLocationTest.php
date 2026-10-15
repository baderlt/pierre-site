<?php

namespace Tests\Feature;

use App\Domain\ContentWriter;
use App\Models\SiteSetting;
use App\Models\User;
use App\Rules\GoogleMapsLocation;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class MagasinLocationTest extends TestCase
{
    use DatabaseMigrations;

    public function test_location_requires_approved_contacts_address_and_valid_maps_link_and_invalidates_cache(): void
    {
        $this->seed();
        $site=SiteSetting::firstOrFail();
        $site->update(['public_enabled'=>true,'contacts_visible'=>true,'address'=>'QA ONLY test address','maps_directions_url'=>null]);
        $this->getJson('/api/v1/site?locale=fr')->assertOk()->assertJsonPath('data.contacts.maps_directions_url',null);
        $url='https://www.google.com/maps/dir/?api=1&destination=QA+ONLY';
        $site->update(['maps_directions_url'=>$url]);
        foreach (['fr','en','ar'] as $locale) {
            $this->getJson('/api/v1/site?locale='.$locale)->assertOk()->assertJsonPath('data.contacts.maps_directions_url',$url);
        }
        $site->update(['contacts_visible'=>false]);
        $this->getJson('/api/v1/site?locale=fr')->assertOk()->assertJsonPath('data.contacts',null);
        $site->update(['contacts_visible'=>true,'address'=>'']);
        $this->getJson('/api/v1/site?locale=fr')->assertOk()->assertJsonPath('data.contacts.maps_directions_url',null);
        $site->update(['address'=>'QA ONLY','maps_directions_url'=>'https://evil.example/maps']);
        $this->getJson('/api/v1/site?locale=fr')->assertOk()->assertJsonPath('data.contacts.maps_directions_url',null);
        $site->update(['public_enabled'=>false]);
        $this->getJson('/api/v1/site?locale=fr')->assertNotFound();
    }

    public function test_existing_authorized_settings_writer_saves_and_rejects_unsafe_location_urls(): void
    {
        $this->seed();
        $this->actingAs(User::factory()->create(['role'=>'super_admin','active'=>true]));
        $site=SiteSetting::firstOrFail();
        $before=$site->only(['brand_name','address','phone','email','contacts_visible']);
        $data=$site->only($site->getFillable());
        $url='https://maps.app.goo.gl/QAOnlyFixture';
        app(ContentWriter::class)->save(SiteSetting::class,[...$data,'maps_directions_url'=>$url],$site);
        $this->assertSame($url,$site->fresh()->maps_directions_url);
        $this->assertSame($before,$site->fresh()->only(array_keys($before)));
        try {
            app(ContentWriter::class)->save(SiteSetting::class,[...$data,'maps_directions_url'=>'https://www.google.com.evil.example/maps?q=x'],$site);
            $this->fail('Unsafe URL accepted');
        } catch (ValidationException $e) {
            $this->assertArrayHasKey('maps_directions_url',$e->errors());
        }
        $this->assertSame($url,$site->fresh()->maps_directions_url);
        app(ContentWriter::class)->save(SiteSetting::class,[...$data,'maps_directions_url'=>null],$site);
        $this->assertNull($site->fresh()->maps_directions_url);
    }

    public function test_maps_links_reject_open_redirects_credentials_and_unapproved_hosts(): void
    {
        foreach (['https://www.google.com/maps?q=Taza','https://www.google.com/maps/dir/?api=1&destination=Taza','https://www.google.com/maps/place/Taza/','https://maps.google.com/?q=Taza','https://maps.app.goo.gl/ApprovedPin','https://maps.app.goo.gl/ApprovedPin?g_st=iw','https://goo.gl/maps/ApprovedPin'] as $url) {
            $this->assertTrue(GoogleMapsLocation::accepts($url));
        }
        foreach (['','javascript:alert(1)','http://www.google.com/maps?q=x','https://evil.example/maps?q=x','https://www.google.com.evil.example/maps?q=x','https://evil@www.google.com/maps?q=x','https://www.google.com:443/maps?q=x','https://www.google.com/url?q=x','https://www.google.com/maps?q=x&continue=https://evil.example','https://www.google.com/maps','https://maps.app.goo.gl/Pin?url=https://evil.example','https://www.google.com/maps?q=x#redirect','https://www.google.com/maps?q=x%0d%0a'] as $url) {
            $this->assertFalse(GoogleMapsLocation::accepts($url));
        }
    }

    public function test_filament_location_field_is_translated_and_saves_through_the_existing_editor(): void
    {
        $this->seed();
        $this->actingAs(User::factory()->create(['role'=>'super_admin','active'=>true]));
        \Filament\Facades\Filament::setCurrentPanel(\Filament\Facades\Filament::getPanel('admin'));
        \Filament\Facades\Filament::bootCurrentPanel();
        $site=SiteSetting::firstOrFail();
        foreach (['fr','en','ar'] as $locale) {
            app()->setLocale($locale);
            $this->withSession(['admin_locale'=>$locale])->get('/admin/site-settings/'.$site->id.'/edit')
                ->assertOk()->assertSee(__('Google Maps location / directions URL'));
        }
        \Livewire\Livewire::test(\App\Filament\Resources\SiteSettingResource\EditSiteSetting::class,['record'=>$site->id])
            ->fillForm(['maps_directions_url'=>'https://evil.example/maps'])
            ->call('save')->assertHasFormErrors(['maps_directions_url'])
            ->fillForm(['maps_directions_url'=>'https://www.google.com/maps?q=QA+ONLY'])
            ->call('save')->assertHasNoFormErrors();
        $this->assertSame('https://www.google.com/maps?q=QA+ONLY',$site->fresh()->maps_directions_url);
    }
}
