<?php

namespace App\Filament\Resources\MediaResource;

use App\Filament\Pages\ListContent;
use App\Filament\Resources\MediaResource;

class ListMedia extends ListContent
{
    protected static string $resource = MediaResource::class;

    protected function getHeaderWidgets(): array
    {
        return [\App\Filament\Widgets\WebsiteImages::class];
    }
}
