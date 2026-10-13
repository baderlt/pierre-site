<?php

namespace App\Filament\Resources;

use App\Models\Category;

class CategoryResource extends ContentResource
{
    protected static ?string $model = Category::class;

    protected static ?string $navigationLabel = 'Categories';

    protected static string|\UnitEnum|null $navigationGroup = 'Catalogue';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-squares-2x2';

    public static function getPages(): array
    {
        return ['index' => CategoryResource\ListCategory::route('/'), 'create' => CategoryResource\CreateCategory::route('/create'), 'edit' => CategoryResource\EditCategory::route('/{record}/edit')];
    }
}
