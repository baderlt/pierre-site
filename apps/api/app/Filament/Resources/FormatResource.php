<?php

namespace App\Filament\Resources;

use App\Models\Format;

class FormatResource extends ContentResource
{
    protected static ?string $model = Format::class;

    protected static ?string $navigationLabel = 'Formats';

    protected static string|\UnitEnum|null $navigationGroup = 'Catalogue';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-squares-2x2';

    public static function getPages(): array
    {
        return ['index' => FormatResource\ListFormat::route('/'), 'create' => FormatResource\CreateFormat::route('/create'), 'edit' => FormatResource\EditFormat::route('/{record}/edit')];
    }
}
