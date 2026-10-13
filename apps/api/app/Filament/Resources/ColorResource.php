<?php

namespace App\Filament\Resources;

use App\Models\Color;

class ColorResource extends ContentResource
{
    protected static ?string $model = Color::class;

    protected static ?string $navigationLabel = 'Colors';

    protected static string|\UnitEnum|null $navigationGroup = 'Catalogue';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-squares-2x2';

    public static function getPages(): array
    {
        return ['index' => ColorResource\ListColor::route('/'), 'create' => ColorResource\CreateColor::route('/create'), 'edit' => ColorResource\EditColor::route('/{record}/edit')];
    }
}
