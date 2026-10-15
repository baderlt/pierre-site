<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\SiteSetting;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SecurityReadinessTest extends TestCase
{
    use DatabaseMigrations;

    public function test_proxy_identity_is_authenticated_validated_and_canonicalized(): void
    {
        config(['integration.proxy_secret' => str_repeat('q', 32)]);
        $limit = function ($client, $secret = null) {
            $r = Request::create('/api/v1/quotations', 'POST', server: ['REMOTE_ADDR' => '192.0.2.1', 'HTTP_X_TIME_STONE_CLIENT' => $client, 'HTTP_X_TIME_STONE_PROXY' => $secret ?? 'wrong']);
            return RateLimiter::limiter('quotations')($r)->key;
        };
        $direct = hash('sha256', '192.0.2.1');
        $this->assertSame($direct, $limit('198.51.100.1'));
        $this->assertSame($direct, $limit('arbitrary-identity', str_repeat('q', 32)));
        $this->assertSame($direct, $limit('198.51.100.1, 127.0.0.1', str_repeat('q', 32)));
        $this->assertSame(hash('sha256', '198.51.100.1'), $limit('198.51.100.1', str_repeat('q', 32)));
        $this->assertSame($limit('2001:db8::1', str_repeat('q', 32)), $limit('2001:0db8:0:0:0:0:0:1', str_repeat('q', 32)));
    }

    public function test_unsigned_storage_paths_and_originals_are_not_public(): void
    {
        Storage::fake('local');
        Storage::disk('local')->put('media/qa/original.png', 'private fixture');
        $this->get('/storage/media/qa/original.png')->assertForbidden();
        $this->get('/storage/media/qa/original.png?upload=1')->assertForbidden();
        $this->get('/media/1/original')->assertNotFound();
    }

    public function test_only_explicit_reverse_proxies_can_supply_client_ip_and_scheme(): void
    {
        \Illuminate\Http\Middleware\TrustProxies::at(['192.0.2.10']);
        $probe = function ($remote) {
            $request = Request::create('http://api.gos-cert.org/api/v1/site', server: ['REMOTE_ADDR' => $remote, 'HTTP_X_FORWARDED_FOR' => '203.0.113.4', 'HTTP_X_FORWARDED_PROTO' => 'https', 'HTTP_X_FORWARDED_HOST' => 'evil.invalid']);
            (new \Illuminate\Http\Middleware\TrustProxies)->handle($request, fn () => response('ok'));
            return [$request->ip(), $request->getScheme(), $request->getHost()];
        };
        try {
            $this->assertSame(['203.0.113.4', 'https', 'api.gos-cert.org'], $probe('192.0.2.10'));
            $this->assertSame(['192.0.2.11', 'http', 'api.gos-cert.org'], $probe('192.0.2.11'));
        } finally {
            \Illuminate\Http\Middleware\TrustProxies::at([]);
            Request::setTrustedProxies([], Request::HEADER_X_FORWARDED_FOR | Request::HEADER_X_FORWARDED_PROTO);
        }
    }

    public function test_sitemap_data_excludes_drafts_demonstrations_and_missing_translations(): void
    {
        $this->seed();
        SiteSetting::first()->update(['public_enabled' => true]);
        $product = Product::factory()->published()->create(['illustrative' => false]);
        $product->translations()->where('locale', 'en')->delete();
        $response = $this->getJson('/api/v1/seo')->assertOk();
        $entry = collect($response->json('data'))->firstWhere('path', 'products/'.$product->slug);
        $this->assertNotNull($entry);
        $this->assertNotContains('en', $entry['locales']);
        $this->assertContains('fr', $entry['locales']);
        $product->update(['status' => 'draft', 'published_at' => null]);
        $this->assertNull(collect($this->getJson('/api/v1/seo')->assertOk()->json('data'))->firstWhere('path', 'products/'.$product->slug));
        $product->update(['status' => 'published', 'published_at' => now(), 'illustrative' => true]);
        $this->assertNull(collect($this->getJson('/api/v1/seo')->assertOk()->json('data'))->firstWhere('path', 'products/'.$product->slug));
        SiteSetting::first()->update(['public_enabled' => false]);
        $this->getJson('/api/v1/seo')->assertNotFound();
    }

    public function test_sitemap_locale_eligibility_includes_visible_section_translations(): void
    {
        $this->seed();
        SiteSetting::first()->update(['public_enabled' => true]);
        $page = \App\Models\Page::where('slug', 'home')->firstOrFail();
        $page->update(['status' => 'published', 'published_at' => now()]);
        foreach (['fr', 'en', 'ar'] as $locale) {
            $page->translations()->updateOrCreate(['locale' => $locale], ['name' => 'QA page']);
        }
        $section = $page->sections()->create(['key' => 'qa-section', 'type' => 'story', 'visible' => true]);
        $section->translations()->create(['locale' => 'fr', 'name' => 'QA title', 'description' => 'QA description']);
        $section->translations()->create(['locale' => 'en', 'name' => 'QA title']);
        $entry = collect($this->getJson('/api/v1/seo')->assertOk()->json('data'))->firstWhere('path', '');
        $this->assertSame(['fr'], $entry['locales']);
        $section->translations()->where('locale', 'en')->first()->update(['description' => 'QA description']);
        $entry = collect($this->getJson('/api/v1/seo')->assertOk()->json('data'))->firstWhere('path', '');
        $this->assertSame(['fr', 'en'], $entry['locales']);
    }

    public function test_proxy_allowlist_rejects_wildcards_and_default_routes(): void
    {
        $before = getenv('TRUSTED_PROXIES');
        putenv('TRUSTED_PROXIES=*,0.0.0.0/0,::/0,192.0.2.10,198.51.100.0/24,2001:db8::/32');
        try {
            $configuration = require config_path('integration.php');
            $this->assertSame(['192.0.2.10', '198.51.100.0/24', '2001:db8::/32'], $configuration['trusted_proxies']);
        } finally {
            putenv($before === false ? 'TRUSTED_PROXIES' : 'TRUSTED_PROXIES='.$before);
        }
    }

    public function test_preflight_is_read_only_and_rejects_unsafe_production_configuration(): void
    {
        $this->artisan('time-stone:preflight')->assertFailed();
        $this->app['env'] = 'production';
        try {
            config(['app.debug' => false, 'app.key' => 'base64:'.base64_encode(str_repeat('k', 32)), 'app.url' => 'https://api.gos-cert.org', 'integration.website_origin' => 'https://gos-cert.org', 'integration.proxy_secret' => str_repeat('q', 32), 'integration.diagnostics' => false, 'session.driver' => 'database', 'session.secure' => true, 'session.http_only' => true, 'session.encrypt' => true, 'session.same_site' => 'lax', 'session.domain' => null, 'mail.default' => 'array']);
            $this->artisan('time-stone:preflight')->assertSuccessful();
            config(['app.debug' => true]);
            $this->artisan('time-stone:preflight')->assertFailed();
            config(['app.debug' => false, 'app.key' => 'malformed-key']);
            $this->artisan('time-stone:preflight')->assertFailed();
        } finally {
            $this->app['env'] = 'testing';
        }
    }
}

