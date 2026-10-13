<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class IntegrationTiming
{
    public function handle(Request $request, Closure $next)
    {
        $secret = config('integration.proxy_secret');
        $trustedProbe = $request->header('X-Time-Stone-Diagnostics') === '1'
            && $secret && hash_equals($secret, (string) $request->header('X-Time-Stone-Proxy'));
        if (! app()->environment(['local', 'testing']) || (! config('integration.diagnostics') && ! $trustedProbe)) {
            return $next($request);
        }

        // Aggregate timings only: never log SQL, bindings, headers or customer input.
        $databaseMs = 0;
        $queries = 0;
        $request->attributes->set('integration.diagnostics', true);
        $started = defined('LARAVEL_START') ? LARAVEL_START : microtime(true);
        DB::listen(function ($query) use (&$databaseMs, &$queries) {
            $databaseMs += $query->time;
            $queries++;
        });
        $response = $next($request);
        $elapsed = (microtime(true) - $started) * 1000;
        $response->headers->set('Server-Timing', sprintf('app;dur=%.2f, db;dur=%.2f, queries;desc="%d"', $elapsed, $databaseMs, $queries));
        $response->headers->set('X-Request-ID', (string) Str::uuid());

        return $response;
    }
}
