<?php

namespace App\Filament\Resources;

use App\Models\Page;

class PageResource extends ContentResource
{
    protected static ?string $model = Page::class;

    protected static ?string $navigationLabel = 'Pages';

    protected static string|\UnitEnum|null $navigationGroup = 'Content';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-squares-2x2';

    public static function getPages(): array
    {
        return ['index' => PageResource\ListPage::route('/'), 'create' => PageResource\CreatePage::route('/create'), 'edit' => PageResource\EditPage::route('/{record}/edit')];
    }
}
