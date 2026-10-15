<?php

use App\Http\Middleware\SecurityHeaders;
use App\Http\Middleware\IntegrationTiming;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(headers: Request::HEADER_X_FORWARDED_FOR | Request::HEADER_X_FORWARDED_PROTO);
        $middleware->append([IntegrationTiming::class, SecurityHeaders::class]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->report(function (Throwable $e) {
            if (request()->is('api/v1/quotations')) {
                Log::error('Quotation submission failed', ['exception_class' => get_class($e)]);

                return false;
            }
        });
        $exceptions->render(function (Throwable $e, Request $r) {
            if (! $r->is('api/*')) {
                return null;
            }
            $status = $e instanceof ValidationException ? 422 : ($e instanceof AuthenticationException ? 401 : ($e instanceof AuthorizationException ? 403 : ($e instanceof ModelNotFoundException ? 404 : ($e instanceof HttpExceptionInterface ? $e->getStatusCode() : 500))));
            $body = ['message' => match ($status) {
                422 => 'Please check your information.',404 => 'Resource unavailable.',409 => 'Request identifier conflict.',429 => 'Too many requests. Please retry later.',403 => 'Access denied.',default => $status >= 500 ? 'Service temporarily unavailable.' : 'Invalid request.'
            }];
            if ($e instanceof ValidationException) {
                $body['errors'] = $e->errors();
            }

            $response = response()->json($body, $status)->header('Cache-Control', 'private, no-store');
            if ($status === 429 && $e instanceof HttpExceptionInterface) {
                $retry = $e->getHeaders()['Retry-After'] ?? null;
                if (is_numeric($retry) && (int) $retry > 0) {
                    $response->headers->set('Retry-After', (string) (int) $retry);
                }
            }

            return $response;
        });
    })->create();
