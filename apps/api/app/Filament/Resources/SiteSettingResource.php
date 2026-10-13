<?php

namespace App\Filament\Resources;

use App\Models\SiteSetting;

class SiteSettingResource extends ContentResource
{
    protected static ?string $model = SiteSetting::class;

    protected static ?string $navigationLabel = 'Website settings';

    protected static string|\UnitEnum|null $navigationGroup = 'Administration';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-squares-2x2';

    public static function getPages(): array
    {
        return ['index' => SiteSettingResource\ListSiteSetting::route('/'), 'create' => SiteSettingResource\CreateSiteSetting::route('/create'), 'edit' => SiteSettingResource\EditSiteSetting::route('/{record}/edit')];
    }
}
