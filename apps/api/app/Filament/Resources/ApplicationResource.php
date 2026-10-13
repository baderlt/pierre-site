<?php

namespace App\Filament\Resources;

use App\Models\Application;

class ApplicationResource extends ContentResource
{
    protected static ?string $model = Application::class;

    protected static ?string $navigationLabel = 'Applications';

    protected static string|\UnitEnum|null $navigationGroup = 'Content';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-squares-2x2';

    public static function getPages(): array
    {
        return ['index' => ApplicationResource\ListApplication::route('/'), 'create' => ApplicationResource\CreateApplication::route('/create'), 'edit' => ApplicationResource\EditApplication::route('/{record}/edit')];
    }
}
