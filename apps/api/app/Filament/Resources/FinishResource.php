<?php

namespace App\Filament\Resources;

use App\Models\Finish;

class FinishResource extends ContentResource
{
    protected static ?string $model = Finish::class;

    protected static ?string $navigationLabel = 'Finishes';

    protected static string|\UnitEnum|null $navigationGroup = 'Catalogue';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-squares-2x2';

    public static function getPages(): array
    {
        return ['index' => FinishResource\ListFinish::route('/'), 'create' => FinishResource\CreateFinish::route('/create'), 'edit' => FinishResource\EditFinish::route('/{record}/edit')];
    }
}
