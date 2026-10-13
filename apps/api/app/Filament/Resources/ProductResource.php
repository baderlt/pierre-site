<?php

namespace App\Filament\Resources;

use App\Models\Product;

class ProductResource extends ContentResource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationLabel = 'Products';

    protected static string|\UnitEnum|null $navigationGroup = 'Catalogue';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-squares-2x2';

    public static function getPages(): array
    {
        return ['index' => ProductResource\ListProduct::route('/'), 'create' => ProductResource\CreateProduct::route('/create'), 'edit' => ProductResource\EditProduct::route('/{record}/edit')];
    }
}
