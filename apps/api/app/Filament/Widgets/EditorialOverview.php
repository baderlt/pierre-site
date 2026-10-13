<?php

namespace App\Filament\Widgets;

use App\Models\Application;
use App\Models\Page;
use App\Models\Product;
use App\Models\QuotationRequest;
use Filament\Widgets\Widget;

class EditorialOverview extends Widget
{
    protected static bool $isLazy = false;

    protected static ?int $sort = 1;

    protected string $view = 'admin.editorial-overview';

    protected int|string|array $columnSpan = 'full';

    protected function getViewData(): array
    {
        $changes = collect();
        foreach ([Product::class => 'products', Application::class => 'applications', Page::class => 'pages'] as $class => $route) {
            $changes = $changes->merge($class::with('translations')->latest('updated_at')->limit(5)->get()->map(fn ($m) => ['label' => $m->label(app()->getLocale()) ?? $m->slug, 'updated_at' => $m->updated_at, 'url' => url('/admin/'.$route.'/'.$m->id.'/edit')]));
        }

        return ['changes' => $changes->sortByDesc('updated_at')->take(6), 'quotes' => QuotationRequest::latest('submitted_at')->limit(5)->get(), 'homepage' => Page::where('slug', 'home')->value('id')];
    }
}
