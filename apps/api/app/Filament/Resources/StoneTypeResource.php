<?php

namespace App\Filament\Resources;

use App\Models\StoneType;

class StoneTypeResource extends ContentResource
{
    protected static ?string $model = StoneType::class;

    protected static ?string $navigationLabel = 'Materials';

    protected static string|\UnitEnum|null $navigationGroup = 'Catalogue';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-squares-2x2';

    public static function getPages(): array
    {
        return ['index' => StoneTypeResource\ListStoneType::route('/'), 'create' => StoneTypeResource\CreateStoneType::route('/create'), 'edit' => StoneTypeResource\EditStoneType::route('/{record}/edit')];
    }
}
