<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class QuotationBoundary
{
    public function handle(Request $r, Closure $next)
    {
        abort_unless($r->isJson(), 415, 'JSON required.');
        abort_if(strlen($r->getContent()) > 65536, 413, 'Payload too large.');
        $origin = $r->header('Origin');
        abort_if($origin && $origin !== config('integration.website_origin'), 403, 'Origin not allowed.');

        return $next($r);
    }
}
