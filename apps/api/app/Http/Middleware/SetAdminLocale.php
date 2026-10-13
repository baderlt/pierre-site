<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetAdminLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->session()->get('admin_locale', 'fr');
        app()->setLocale(in_array($locale, ['fr', 'en', 'ar'], true) ? $locale : 'fr');

        return $next($request);
    }
}
