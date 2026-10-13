<?php

namespace App\Filament\Resources;

use App\Models\PageSection;

class PageSectionResource extends ContentResource
{
    protected static ?string $model = PageSection::class;

    protected static ?string $navigationLabel = 'Page sections';

    protected static string|\UnitEnum|null $navigationGroup = 'Content';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-squares-2x2';

    public static function getPages(): array
    {
        return ['index' => PageSectionResource\ListPageSection::route('/'), 'create' => PageSectionResource\CreatePageSection::route('/create'), 'edit' => PageSectionResource\EditPageSection::route('/{record}/edit')];
    }
}
