<?php

namespace App\Filament\Resources;

use App\Models\Media;

class MediaResource extends ContentResource
{
    protected static ?string $model = Media::class;

    protected static ?string $navigationLabel = 'Media library';

    protected static string|\UnitEnum|null $navigationGroup = 'Content';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-squares-2x2';

    public static function getPages(): array
    {
        return ['index' => MediaResource\ListMedia::route('/'), 'create' => MediaResource\CreateMedia::route('/create'), 'edit' => MediaResource\EditMedia::route('/{record}/edit')];
    }
}
