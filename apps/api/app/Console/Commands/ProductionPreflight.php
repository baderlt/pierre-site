<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ProductionPreflight extends Command
{
    protected $signature = 'time-stone:preflight';

    protected $description = 'Read-only production configuration checks; never prints credentials';

    public function handle(): int
    {
        $key = (string) config('app.key');
        if (str_starts_with($key, 'base64:')) {
            $key = base64_decode(substr($key, 7), true);
        }
        $validKey = is_string($key) && \Illuminate\Encryption\Encrypter::supported($key, config('app.cipher'));
        $origin = function ($value) {
            $url = parse_url((string) $value);
            return $url && ($url['scheme'] ?? '') === 'https' && ! empty($url['host'])
                && ! isset($url['user']) && ! isset($url['pass']) && ! isset($url['query']) && ! isset($url['fragment'])
                && in_array($url['path'] ?? '', ['', '/'], true);
        };
        $checks = [
            'Production application environment' => app()->isProduction(),
            'Debug disabled' => config('app.debug') === false,
            'Valid application encryption key configured' => $validKey,
            'HTTPS API origin' => $origin(config('app.url')),
            'HTTPS website origin' => $origin(config('integration.website_origin')),
            'Private proxy secret configured (32+ characters)' => strlen((string) config('integration.proxy_secret')) >= 32,
            'Secure encrypted database sessions' => config('session.driver') === 'database' && config('session.secure') && config('session.http_only') && config('session.encrypt') && config('session.same_site') === 'lax',
            'Host-only session cookie' => ! config('session.domain'),
            'Private local media disk' => config('filesystems.default') === 'local' && config('filesystems.disks.local.root') === storage_path('app/private'),
            'Production diagnostics disabled' => ! config('integration.diagnostics'),
            'Bounded enabled rate limits' => config('integration.quotation_per_minute') >= 1 && config('integration.quotation_per_minute') <= 5 && config('integration.public_per_minute') >= 1 && config('integration.public_per_minute') <= 120,
            'External messaging disabled' => config('mail.default') === 'array',
        ];
        foreach ($checks as $label => $passed) {
            $this->line(($passed ? 'PASS ' : 'FAIL ').$label);
        }

        return in_array(false, array_map(fn ($passed) => (bool) $passed, $checks), true) ? self::FAILURE : self::SUCCESS;
    }
}
