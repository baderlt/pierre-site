<?php

namespace App\Providers\Filament;

use App\Filament\LocalAvatarProvider;
use App\Http\Middleware\SetAdminLocale;
use Filament\FontProviders\LocalFontProvider;
use Filament\Forms\Components\Field;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Infolists\Components\Entry;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Tables\Columns\Column;
use Filament\Tables\Filters\BaseFilter;
use Filament\View\PanelsRenderHook;
use Filament\Widgets\AccountWidget;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->defaultAvatarProvider(LocalAvatarProvider::class)
            ->renderHook(PanelsRenderHook::HEAD_END, fn () => view('admin.branding'))
            ->renderHook(PanelsRenderHook::TOPBAR_END, fn () => view('admin.language-switcher'))
            ->renderHook(PanelsRenderHook::AUTH_LOGIN_FORM_BEFORE, fn () => view('admin.language-switcher'))
            ->id('admin')
            ->path('admin')
            ->login()
            ->brandName(fn () => __('TIME STONE · Administration'))
            ->bootUsing(function () {
                Field::configureUsing(fn (Field $field) => $field->translateLabel());
                Entry::configureUsing(fn (Entry $entry) => $entry->translateLabel());
                Column::configureUsing(fn (Column $column) => $column->translateLabel());
                BaseFilter::configureUsing(fn (BaseFilter $filter) => $filter->translateLabel());
            })
            ->databaseTransactions()
            ->font('Inter', provider: LocalFontProvider::class)
            ->colors([
                'primary' => Color::hex('#80602f'),
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([
                AccountWidget::class,

            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                SetAdminLocale::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                PreventRequestForgery::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->persistentMiddleware([SetAdminLocale::class])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
