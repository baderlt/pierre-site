<?php

namespace Tests\Feature;

use App\Models\Finish;
use App\Models\Format;
use App\Models\Product;
use App\Models\QuotationRequest;
use App\Models\SiteSetting;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use Tests\TestCase;

class IntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        SiteSetting::first()->update(['public_enabled' => true]);
        config(['integration.quotation_per_minute' => 100]);
    }

    private function payload(): array
    {
        return ['locale' => 'fr', 'customer' => ['name' => 'QA ONLY Test', 'email' => 'qa-only@example.test', 'phone' => null], 'delivery' => ['country_code' => 'MA', 'location' => 'QA only'], 'project_details' => 'Synthetic integration enquiry', 'items' => [], 'privacy_acknowledged' => true, 'website' => '', 'challenge' => Crypt::encryptString(json_encode(['issued' => time() - 5, 'nonce' => 'test']))];
    }

    private function product(): Product
    {
        $p = Product::factory()->published()->create();
        $p->finishes()->attach(Finish::where('slug', 'honed')->value('id'));
        $p->formats()->attach(Format::where('slug', 'slab')->value('id'), ['width' => 180, 'height' => 120, 'thickness' => 3, 'verified' => false, 'allow_custom' => true]);
        $p->configuration()->create(['geometry' => 'slab', 'width' => 180, 'height' => 120, 'thickness' => 3]);

        return $p;
    }

    private function item(Product $p): array
    {
        return ['product_id' => (string) $p->id, 'format_id' => (string) $p->formats->first()->id, 'finish_id' => (string) $p->finishes->first()->id, 'dimensions_cm' => ['width' => '180', 'height' => '120', 'thickness' => '3'], 'quantity' => '20', 'unit' => 'm2', 'custom_dimensions_requested' => false];
    }

    private function submit(array $payload, ?string $key = null)
    {
        return $this->withHeader('Idempotency-Key', $key ?? (string) Str::uuid())->postJson('/api/v1/quotations', $payload);
    }

    public function test_general_enquiry_is_persisted_and_duplicate_retries_return_same_reference(): void
    {
        $key = (string) Str::uuid();
        $p = $this->payload();
        $r = $this->submit($p, $key)->assertCreated()->assertHeader('Cache-Control', 'no-store, private');
        $this->submit($p, $key)->assertOk()->assertJsonPath('duplicate', true)->assertJsonPath('reference', $r->json('reference'));
        $this->assertDatabaseCount('quotation_requests', 1);
        $p['project_details'] = 'Changed';
        $this->submit($p, $key)->assertStatus(409);
        $this->assertDatabaseCount('quotation_requests', 1);
    }

    public function test_product_snapshots_are_authoritative_immutable_and_support_multiple_items(): void
    {
        $product = $this->product();
        $p = $this->payload();
        $p['items'] = [$this->item($product), $this->item($product)];
        $this->submit($p)->assertCreated();
        $quote = QuotationRequest::first();
        $this->assertCount(2, $quote->items);
        $name = $quote->items->first()->product_snapshot['name'];
        $product->translations()->where('locale', 'fr')->update(['name' => 'Changed after request']);
        $this->assertSame($name, $quote->fresh()->items->first()->product_snapshot['name']);
        $this->assertTrue($quote->items->first()->configuration_snapshot['manufacturing_confirmation_required']);
        $this->getJson('/api/v1/quotations/'.$quote->reference)->assertNotFound();
        $this->get('/admin/quotation-requests/'.$quote->id.'/edit')->assertRedirect('/admin/login');
    }

    public function test_invalid_privacy_country_email_dimensions_and_unknown_browser_fields_are_rejected(): void
    {
        $p = $this->payload();
        $p['privacy_acknowledged'] = false;
        $p['delivery']['country_code'] = 'ZZ';
        $p['customer']['email'] = 'bad';
        $this->submit($p)->assertUnprocessable()->assertJsonValidationErrors(['privacy_acknowledged', 'delivery.country_code', 'customer.email']);
        $product = $this->product();
        $p = $this->payload();
        $p['items'] = [$this->item($product)];
        $p['items'][0]['dimensions_cm']['width'] = 0;
        $p['items'][0]['product_name'] = 'Injected';
        $this->submit($p)->assertUnprocessable();
        $this->assertDatabaseCount('quotation_requests', 0);
    }

    public function test_draft_unsupported_combinations_and_disallowed_custom_dimensions_do_not_persist(): void
    {
        $product = $this->product();
        $p = $this->payload();
        $p['items'] = [$this->item($product)];
        $product->update(['status' => 'draft']);
        $this->submit($p)->assertUnprocessable();
        $product->update(['status' => 'published']);
        $p['items'][0]['finish_id'] = (string) Finish::where('slug', 'polished')->value('id');
        $this->submit($p)->assertUnprocessable();
        $p['items'] = [$this->item($product)];
        $p['items'][0]['dimensions_cm']['width'] = 181;
        $p['items'][0]['custom_dimensions_requested'] = true;
        $product->formats()->updateExistingPivot($product->formats->first()->id, ['allow_custom' => false]);
        $this->submit($p)->assertUnprocessable();
        $this->assertDatabaseCount('quotation_requests', 0);
    }

    public function test_custom_requests_and_brushed_finishes_are_saved_without_fabricated_simulations(): void
    {
        $product = $this->product();
        $finish = Finish::where('slug', 'brushed')->first();
        $product->finishes()->attach($finish);
        $p = $this->payload();
        $item = $this->item($product);
        $item['finish_id'] = (string) $finish->id;
        $item['dimensions_cm']['thickness'] = '4';
        $item['custom_dimensions_requested'] = true;
        $p['items'] = [$item];
        $this->submit($p)->assertCreated();
        $saved = QuotationRequest::first()->items->first();
        $this->assertNull($saved->finish_snapshot['simulation']);
        $this->assertTrue($saved->custom_dimensions_requested);
        $this->assertNull($saved->configuration_snapshot['requested_visual']);
    }

    public function test_mismatched_viewer_config_and_fractional_pieces_are_rejected(): void
    {
        $p = $this->payload();
        $product = $this->product();
        $i = $this->item($product);
        $i['quantity'] = '1.5';
        $i['unit'] = 'piece';
        $p['items'] = [$i];
        $this->submit($p)->assertUnprocessable();
        $p['items'][0]['quantity'] = '2';
        $p['items'][0]['configuration'] = ['version' => 1, 'shape' => 'block', 'finish' => 'honed', 'width' => 180, 'height' => 120, 'thickness' => 3, 'scale' => 1, 'rotation' => 0];
        $this->submit($p)->assertUnprocessable();
    }

    public function test_honeypot_timing_expiry_and_missing_idempotency_are_rejected(): void
    {
        $p = $this->payload();
        $p['website'] = 'spam';
        $this->submit($p)->assertUnprocessable();
        $p = $this->payload();
        $p['challenge'] = Crypt::encryptString(json_encode(['issued' => time()]));
        $this->submit($p)->assertUnprocessable();
        $p['challenge'] = Crypt::encryptString(json_encode(['issued' => time() - 7201]));
        $this->submit($p)->assertUnprocessable();
        $p['challenge'] = 'forged';
        $this->submit($p)->assertUnprocessable();
        $p = $this->payload();
        $this->withHeader('Idempotency-Key', 'invalid')->postJson('/api/v1/quotations', $p)->assertUnprocessable();
    }

    public function test_rate_limits_payload_size_origin_and_safe_errors(): void
    {
        config(['integration.quotation_per_minute' => 1]);
        $this->submit($this->payload())->assertCreated();
        $limited = $this->submit($this->payload())->assertTooManyRequests();
        $this->assertGreaterThanOrEqual(1, (int) $limited->headers->get('Retry-After'));
        $this->assertLessThanOrEqual(60, (int) $limited->headers->get('Retry-After'));
        $limited->assertJsonMissingPath('exception')->assertHeader('Cache-Control', 'no-store, private');
        config(['integration.quotation_per_minute' => 100]);
        $this->withHeader('Origin', 'https://evil.invalid')->postJson('/api/v1/quotations', $this->payload())->assertForbidden();
        $this->withHeader('Origin', config('integration.website_origin'))->postJson('/api/v1/quotations', ['x' => str_repeat('x', 66000)])->assertStatus(413);
        $this->getJson('/api/v1/does-not-exist')->assertNotFound()->assertJsonMissingPath('exception')->assertJsonMissingPath('trace');
    }

    public function test_published_api_delivers_saved_material_options_and_production_hides_fixtures(): void
    {
        $product = $this->product();
        $this->getJson('/api/v1/products/'.$product->slug.'?locale=ar')->assertOk()->assertJsonPath('data.material_parameters.roughness', 0.6)->assertJsonPath('data.finish_options.0.slug', 'honed');
        $this->app['env'] = 'production';
        $this->assertSame(0, Product::publicCatalogue()->count());
        $product->update(['illustrative' => false]);
        $this->assertSame(1, Product::publicCatalogue()->count());
    }

    public function test_cors_allows_only_the_configured_origin(): void
    {
        $allowed = config('integration.website_origin');
        $this->withHeaders(['Origin' => $allowed, 'Access-Control-Request-Method' => 'POST', 'Access-Control-Request-Headers' => 'content-type,idempotency-key'])->options('/api/v1/quotations')->assertNoContent()->assertHeader('Access-Control-Allow-Origin', $allowed);
        $this->withHeaders(['Origin' => 'https://evil.invalid', 'Access-Control-Request-Method' => 'POST'])->options('/api/v1/quotations')->assertHeader('Access-Control-Allow-Origin', $allowed); // A mismatched allowed origin is rejected by the browser.
    }

    public function test_local_diagnostics_are_aggregate_only_and_disabled_in_production(): void
    {
        $this->getJson('/api/v1/site')->assertHeaderMissing('Server-Timing');
        config(['integration.diagnostics' => true]);
        $response = $this->getJson('/api/v1/site')->assertOk()->assertHeader('X-Content-Cache', 'hit');
        $this->assertMatchesRegularExpression('/^app;dur=[0-9.]+, db;dur=[0-9.]+, queries;desc="[0-9]+"$/', $response->headers->get('Server-Timing'));
        $this->assertTrue(Str::isUuid($response->headers->get('X-Request-ID')));
        $this->app['env'] = 'production';
        $this->getJson('/api/v1/site')->assertHeaderMissing('Server-Timing')->assertHeaderMissing('X-Content-Cache');
    }

    public function test_cached_media_urls_are_scoped_to_the_request_origin(): void
    {
        $image = \App\Models\Media::create(['original_filename' => 'qa-only.webp', 'disk' => 'local', 'path' => 'qa/original.webp', 'mime' => 'image/webp', 'bytes' => 1, 'width' => 64, 'height' => 64, 'purpose' => 'logo', 'processing_status' => 'ready', 'derivatives' => [], 'uploaded_at' => now()]);
        SiteSetting::first()->update(['logo_id' => $image->id]);
        $this->getJson('http://127.0.0.1:8000/api/v1/site')->assertJsonPath('data.logo', 'http://127.0.0.1:8000/media/'.$image->id.'/preview');
        $this->getJson('http://127.0.0.1:8011/api/v1/site')->assertJsonPath('data.logo', 'http://127.0.0.1:8011/media/'.$image->id.'/preview');
    }

    public function test_different_format_presets_with_the_same_geometry_keep_their_real_ids(): void
    {
        $p = $this->product();
        $format = Format::create(['slug' => 'qa-second-slab', 'geometry' => 'slab', 'active' => true]);
        $p->formats()->attach($format->id, ['width' => 90, 'height' => 60, 'thickness' => 2, 'verified' => false, 'allow_custom' => false]);
        $item = $this->item($p);
        $item['format_id'] = (string) $format->id;
        $item['dimensions_cm'] = ['width' => '90', 'height' => '60', 'thickness' => '2'];
        $payload = $this->payload();
        $payload['items'] = [$item];
        $this->submit($payload)->assertCreated();
        $this->assertSame((string) $format->id, QuotationRequest::first()->items->first()->format_snapshot['id']);
    }
}
