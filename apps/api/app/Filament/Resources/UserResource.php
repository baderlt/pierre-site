<?php

namespace App\Filament\Resources;

use App\Models\User;

class UserResource extends ContentResource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationLabel = 'Administrators';

    protected static string|\UnitEnum|null $navigationGroup = 'Administration';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-squares-2x2';

    public static function getPages(): array
    {
        return ['index' => UserResource\ListUser::route('/'), 'create' => UserResource\CreateUser::route('/create'), 'edit' => UserResource\EditUser::route('/{record}/edit')];
    }
}
