<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class GoogleMapsLocation implements ValidationRule
{
    public static function accepts(?string $value): bool
    {
        if (! $value || strlen($value) > 2048 || preg_match('/[\s\\\\]|%0[ad]/i', $value) || ! filter_var($value, FILTER_VALIDATE_URL)) {
            return false;
        }
        $url = parse_url($value);
        if (($url['scheme'] ?? '') !== 'https' || isset($url['user']) || isset($url['pass']) || isset($url['port']) || isset($url['fragment'])) {
            return false;
        }
        $host = strtolower($url['host'] ?? '');
        $path = $url['path'] ?? '';
        parse_str($url['query'] ?? '', $query);
        $shareQuery = ! array_diff(array_keys($query), ['g_st', 'g_ep']) && collect($query)->every(fn ($v) => is_string($v));
        if ($host === 'maps.app.goo.gl') {
            return (bool) preg_match('~^/[a-zA-Z0-9_-]+/?$~', $path) && $shareQuery;
        }
        if ($host === 'goo.gl') {
            return (bool) preg_match('~^/maps/[a-zA-Z0-9_-]+/?$~', $path) && $shareQuery;
        }
        if (! in_array($host, ['www.google.com', 'google.com', 'maps.google.com'], true)
            || (! preg_match('~^/maps(?:/|$)~', $path) && ! ($host === 'maps.google.com' && in_array($path, ['', '/'], true)))) {
            return false;
        }
        if (array_intersect(['url', 'continue', 'redirect', 'next'], array_keys($query))) {
            return false;
        }
        return (bool) preg_match('~^/maps/(?:place|dir|search)/[^/]+~', $path)
            || collect(['q', 'query', 'destination', 'cid'])->contains(fn ($key) => isset($query[$key]) && is_string($query[$key]) && trim($query[$key]) !== '');
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || ! self::accepts($value)) {
            $fail(__('Enter an HTTPS Google Maps location or directions link.'));
        }
    }
}
