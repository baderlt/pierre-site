<?php

namespace App\Providers;

use App\Domain\RetryingDatabaseStore;
use App\Models;
use App\Policies;
use Illuminate\Cache\CacheManager;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Middleware\TrustProxies;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->afterResolving('cache', function (CacheManager $manager) {
            $manager->extend('database', function ($app, array $config) use ($manager) {
                $store = new RetryingDatabaseStore(
                    $app['db']->connection($config['connection'] ?? null),
                    $config['table'],
                    $config['prefix'] ?? $app['config']['cache.prefix'],
                    $config['lock_table'] ?? 'cache_locks',
                    $config['lock_lottery'] ?? [2, 100],
                    $config['lock_timeout'] ?? 86400,
                    $app['config']['cache.serializable_classes'] ?? null,
                );
                $store->setLockConnection($app['db']->connection($config['lock_connection'] ?? $config['connection'] ?? null));

                return $manager->repository($store, $config);
            });
        });
    }

    public function boot(): void
    {
        TrustProxies::at(config('integration.trusted_proxies', []));
        foreach ([Models\Product::class, Models\Category::class, Models\StoneType::class, Models\Finish::class, Models\Format::class, Models\Color::class, Models\Media::class, Models\Application::class, Models\Page::class, Models\PageSection::class] as $class) {
            Gate::policy($class, Policies\ContentPolicy::class);
        }
        Gate::policy(Models\SiteSetting::class, Policies\SettingsPolicy::class);
        Gate::policy(Models\User::class, Policies\UserPolicy::class);
        Gate::policy(Models\QuotationRequest::class, Policies\QuotationPolicy::class);
        RateLimiter::for('quotations', function (Request $r) {
            $secret = config('integration.proxy_secret');
            $trusted = $secret && hash_equals($secret, (string) $r->header('X-Time-Stone-Proxy'));
            $client = $r->header('X-Time-Stone-Client', '');
            $ip = $trusted && filter_var($client, FILTER_VALIDATE_IP) ? inet_ntop(inet_pton($client)) : $r->ip();

            return Limit::perMinute(config('integration.quotation_per_minute'))->by(hash('sha256', $ip));
        });
        RateLimiter::for('public-api', function (Request $r) {
            $secret = config('integration.proxy_secret');
            if ($secret && hash_equals($secret, (string) $r->header('X-Time-Stone-Proxy'))) {
                return Limit::perMinute(6000)->by('trusted-next-read');
            }

            return Limit::perMinute(config('integration.public_per_minute'))->by($r->ip());
        });
        if ($this->app->isProduction()) {
            config(['session.secure' => true, 'session.http_only' => true, 'session.same_site' => 'lax', 'session.encrypt' => true]);
        }
    }
}
