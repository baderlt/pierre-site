<?php

use App\Http\Controllers\PublicCatalogueController as Api;
use App\Http\Controllers\QuotationSubmissionController;
use App\Http\Middleware\QuotationBoundary;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('throttle:public-api')->group(function () {
    Route::get('site', [Api::class, 'site']);
    Route::get('pages/{key}', [Api::class, 'page']);
    foreach (['categories', 'materials', 'finishes', 'formats', 'colors'] as $type) {
        Route::get($type, [Api::class, 'definitions'])->defaults('type', $type);
    }
    Route::get('products', [Api::class, 'products'])->name('api.products.index');
    Route::get('products/{slug}', [Api::class, 'product'])->name('api.products.show');
    Route::get('applications', [Api::class, 'applications']);
    Route::get('applications/{slug}', [Api::class, 'application']);
});

Route::prefix('v1')->group(function () {
    Route::get('quotation-challenge', [QuotationSubmissionController::class, 'challenge'])->middleware('throttle:public-api');
    Route::post('quotations', [QuotationSubmissionController::class, 'store'])->middleware([QuotationBoundary::class, 'throttle:quotations']);
});
