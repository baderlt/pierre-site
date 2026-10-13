<?php

namespace App\Filament\Widgets;

use App\Models\Application;
use App\Models\Category;
use App\Models\Product;
use App\Models\QuotationRequest;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class CatalogueStats extends StatsOverviewWidget
{
    protected static bool $isLazy = false;

    protected static ?int $sort = 0;

    protected function getStats(): array
    {
        $products = Product::selectRaw("COUNT(*) AS total, SUM(status='published') AS published, SUM(status='draft') AS drafts")->first();

        return [Stat::make(__('Total products'), $products->total), Stat::make(__('Published products'), $products->published ?? 0), Stat::make(__('Draft products'), $products->drafts ?? 0), Stat::make(__('Categories'), Category::count()), Stat::make(__('Applications'), Application::count()), Stat::make(__('Quotations'), QuotationRequest::count())];
    }
}
