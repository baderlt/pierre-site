<?php

namespace App\Filament;

use App\Models\Application;
use App\Models\Category;
use App\Models\Color;
use App\Models\Finish;
use App\Models\Format;
use App\Models\Media;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\Product;
use App\Models\QuotationRequest;
use App\Models\SiteSetting;
use App\Models\StoneType;
use App\Models\User;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

class AdminSchemas
{
    public static function translations(bool $alt = false): Tabs
    {
        return Tabs::make('Translations')->tabs(collect(['fr' => 'Français', 'en' => 'English', 'ar' => 'العربية'])->map(function ($label, $locale) use ($alt) {
            $fields = [TextInput::make("translations.$locale.name")->label($alt ? 'Alt text' : 'Name / title')->required(! $alt && $locale === 'fr')->maxLength(200)->extraInputAttributes(['dir' => $locale === 'ar' ? 'rtl' : 'ltr', 'lang' => $locale])];
            if (! $alt) {
                $fields = [...$fields, Textarea::make("translations.$locale.description")->label('Description / body')->rows(5)->maxLength(10000)->extraInputAttributes(['dir' => $locale === 'ar' ? 'rtl' : 'ltr', 'lang' => $locale]), TextInput::make("translations.$locale.cta_label")->label('CTA label')->maxLength(100)->extraInputAttributes(['dir' => $locale === 'ar' ? 'rtl' : 'ltr', 'lang' => $locale]), TextInput::make("translations.$locale.seo_title")->label('SEO title')->maxLength(200)->extraInputAttributes(['dir' => $locale === 'ar' ? 'rtl' : 'ltr', 'lang' => $locale]), Textarea::make("translations.$locale.seo_description")->label('Meta description')->maxLength(500)->extraInputAttributes(['dir' => $locale === 'ar' ? 'rtl' : 'ltr', 'lang' => $locale])];
            }

            return Tab::make($label)->schema($fields);
        })->values()->all())->columnSpanFull();
    }

    public static function media(string $field, string $label, bool $multiple = false): Select
    {
        $select = Select::make($field)->label($label)->searchable()->getSearchResultsUsing(fn (string $search) => Media::where('processing_status', 'ready')->where('original_filename', 'like', '%'.$search.'%')->latest()->limit(50)->pluck('original_filename', 'id')->all());

        return $multiple ? $select->multiple()->getOptionLabelsUsing(fn (array $values) => Media::whereIn('id', $values)->pluck('original_filename', 'id')->all()) : $select->getOptionLabelUsing(fn ($value) => Media::find($value)?->original_filename);
    }

    public static function options(string $field, string $class, string $label): Select
    {
        return Select::make($field)->label($label)->multiple()->options(fn () => $class::with('translations')->orderBy('slug')->get()->mapWithKeys(fn ($record) => [$record->id => $record->label(app()->getLocale()) ?: $record->slug]))->searchable()->default([]);
    }

    public static function upload(string $field, string $label, bool $multiple = false): FileUpload
    {
        return FileUpload::make($field)->label($label)->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])->maxSize(10240)->storeFiles(false)->multiple($multiple)->maxFiles($multiple ? 12 : 1)->helperText(__('JPEG, PNG or WebP; 10 MB, 20 MP maximum. Private original; generated previews never upscale.'));
    }

    public static function fields(string $class): array
    {
        if ($class === User::class) {
            return [Section::make(__('Administrator'))->schema([TextInput::make('name')->required()->maxLength(150), TextInput::make('email')->email()->required(), TextInput::make('password')->password()->minLength(14)->maxLength(128)->helperText(__('Leave blank to retain the password. Minimum 14 characters.')), Select::make('role')->options(['super_admin' => __('Super Admin'), 'content_manager' => __('Content Manager')])->required()->default('content_manager'), Toggle::make('active')->default(false)])->columns(2)];
        }
        if ($class === SiteSetting::class) {
            return self::settings();
        }
        if ($class === QuotationRequest::class) {
            return self::quote();
        }
        if ($class === Media::class) {
            return [Section::make(__('Media library'))->schema([self::upload('upload', 'Upload / replace image'), Select::make('purpose')->options(['image' => __('Image'), 'texture' => __('Texture'), 'logo' => __('Logo'), 'favicon' => __('Favicon')])->required()->default('image'), TextEntry::make('image_preview')->state(fn (?Media $record) => $record?->url('thumb'))->url(fn (?Media $record) => $record?->url('preview'))->label('Open validated preview'), TextEntry::make('metadata')->state(fn (?Media $record) => $record ? "$record->mime · $record->width × $record->height px · $record->bytes bytes" : __('GLB and SVG uploads are disabled. Replacement preserves shared references; original files remain private.'))]), self::translations(true)];
        }
        $model = new $class;
        $identity = [];
        if ($class === PageSection::class) {
            $identity = [Select::make('page_id')->label('Page')->options(fn () => Page::with('translations')->get()->mapWithKeys(fn ($record) => [$record->id => $record->label(app()->getLocale()) ?: $record->slug]))->required(), TextInput::make('key')->extraInputAttributes(['dir' => 'ltr'])->required(), Select::make('type')->options(array_combine(['hero', 'story', 'image_text', 'cta', 'navigation', 'footer', 'quality'], array_map(fn ($label) => __($label), ['Hero', 'Story', 'Image & text', 'CTA', 'Navigation', 'Footer', 'Quality'])))->required(), TextInput::make('link_path')->label('Internal localized destination')->placeholder('/fr/quote')->maxLength(200), Toggle::make('visible')->default(true)];
        } else {
            $identity[] = TextInput::make('slug')->extraInputAttributes(['dir' => 'ltr'])->required()->maxLength(100)->helperText(__('Stable public key: lowercase letters, digits and hyphens. French fallback; shared across languages.'));
        }
        if (in_array('status', $model->getFillable())) {
            $identity[] = Select::make('status')->options(['draft' => __('Draft'), 'published' => __('Published')])->default('draft')->required()->helperText(__('Only published content is exposed by the API. Publication time is recorded on save.'));
        }
        if (in_array('active', $model->getFillable())) {
            $identity[] = Toggle::make('active')->default(true);
        }
        if (in_array('sort_order', $model->getFillable())) {
            $identity[] = TextInput::make('sort_order')->numeric()->minValue(0)->maxValue(100000)->required()->default(0);
        }
        if (in_array('illustrative', $model->getFillable())) {
            $identity[] = Toggle::make('illustrative')->label('Illustrative / temporary content')->default(true)->helperText(__('Disable only after the content has been verified.'));
        }
        if (in_array('image_id', $model->getFillable())) {
            $identity[] = self::media('image_id', 'Image from library');
            if ($class === PageSection::class) {
                $identity[] = self::upload('image_upload', 'Upload banner image')->helperText(__('Banner uploads keep the private original and generate WebP up to 2560 px without upscaling. JPEG, PNG or WebP; 10 MB and 20 MP maximum.'));
                $identity[] = TextEntry::make('banner_preview')->label('Current image')->state(fn (?PageSection $record) => $record?->image?->bannerUrl())->url(fn (?PageSection $record) => $record?->image?->bannerUrl());
            }
        }
        if (in_array('og_image_id', $model->getFillable())) {
            $identity[] = self::media('og_image_id', 'Open Graph image');
        }
        if ($class === Finish::class) {
            $identity[] = Select::make('simulation')->options(['honed' => __('Honed'), 'polished' => __('Polished'), 'rough' => __('Rough')])->placeholder(__('No supported simulation'))->helperText(__('Commercial brushed finish has no matching simulation.'));
        }
        if ($class === Format::class) {
            $identity[] = Select::make('geometry')->options(['slab' => __('Slab'), 'tile' => __('Tile'), 'block' => __('Block')])->required();
        }
        if ($class === Color::class) {
            $identity[] = TextInput::make('swatch')->default('#d8c7ac')->required()->regex('/^#[0-9a-fA-F]{6}$/');
        }
        if ($class === StoneType::class) {
            $identity = [...$identity, TextInput::make('classification')->maxLength(80), Textarea::make('internal_notes')->label('Private technical notes')->maxLength(10000), self::options('finishes', Finish::class, 'Finish definitions'), self::options('colors', Color::class, 'Colors'), self::media('media', 'Material textures', true)];
        }
        $sections = [Section::make(__('Identity & publication'))->schema($identity)->columns(2)->columnSpanFull(), self::translations()];
        if ($class === Product::class) {
            $sections = [...$sections, ...self::product()];
        }
        if ($class === Application::class) {
            $sections[] = Section::make(__('Gallery & related products'))->schema([self::media('gallery', 'Gallery images', true), self::upload('gallery_uploads', 'Add gallery images', true), self::options('products', Product::class, 'Related products')])->columnSpanFull();
        }

        return $sections;
    }

    private static function product(): array
    {
        $dims = fn (string $prefix) => collect(['width', 'height', 'thickness'])->map(fn ($d) => TextInput::make($prefix.$d)->label(ucfirst($d).' (cm)')->numeric()->minValue(.5)->maxValue(500)->required()->default($d === 'thickness' ? 3 : 120))->all();

        return [Section::make(__('Catalogue & media'))->schema([TextInput::make('sku')->label('Internal reference')->maxLength(100), Select::make('category_id')->label('Category')->options(fn () => Category::with('translations')->where('active', true)->get()->mapWithKeys(fn ($record) => [$record->id => $record->label(app()->getLocale()) ?: $record->slug]))->required(), Select::make('stone_type_id')->label('Material')->options(fn () => StoneType::with('translations')->where('active', true)->get()->mapWithKeys(fn ($record) => [$record->id => $record->label(app()->getLocale()) ?: $record->slug]))->required(), Toggle::make('featured')->default(false), self::media('main_image_id', 'Main image'), self::upload('main_upload', 'Upload main image'), self::media('texture_id', 'Texture'), self::upload('texture_upload', 'Upload texture'), self::media('gallery', 'Gallery images', true), self::upload('gallery_uploads', 'Add gallery images', true), self::options('finishes', Finish::class, 'Supported commercial finishes')->required(), self::options('colors', Color::class, 'Colors'), self::options('applications', Application::class, 'Applications')])->columns(2)->columnSpanFull(),
            Section::make(__('Supported formats'))->schema([Repeater::make('format_options')->label('Formats and illustrative defaults')->schema([Select::make('format_id')->label('Format')->options(fn () => Format::with('translations')->where('active', true)->get()->mapWithKeys(fn ($record) => [$record->id => $record->label(app()->getLocale()) ?: $record->slug]))->required(), ...$dims(''), Toggle::make('verified')->label('Dimensions verified')->default(false), Toggle::make('allow_custom')->label('Custom dimensions permitted for review')->default(false)])->columns(3)->minItems(1)->maxItems(3)->defaultItems(1)])->columnSpanFull(),
            Section::make(__('3D configuration · version 1'))->description(__('Procedural visual study, never a reconstruction of hidden surfaces. GLB uploads are disabled pending structural validation.'))->schema([TextInput::make('configuration.version')->label('Schema version')->default(1)->readOnly()->required()->numeric(), Select::make('configuration.geometry')->label('Default geometry')->options(['slab' => __('Slab'), 'block' => __('Block'), 'tile' => __('Tile')])->default('slab')->required(), Select::make('configuration.finish')->label('Finish simulation')->options(['honed' => __('Honed'), 'polished' => __('Polished'), 'rough' => __('Rough')])->default('honed')->required(), ...$dims('configuration.'), Toggle::make('configuration.dimensions_verified')->label('Default dimensions verified')->default(false), TextInput::make('configuration.scale')->label('Texture scale')->numeric()->minValue(.25)->maxValue(4)->default(1)->required(), TextInput::make('configuration.rotation')->label('Texture rotation (degrees)')->numeric()->minValue(0)->maxValue(360)->default(0)->required(), ...collect(['roughness' => .6, 'metalness' => 0, 'bump_strength' => .05])->map(fn ($v, $k) => TextInput::make('configuration.'.$k)->label(ucfirst(str_replace('_', ' ', $k)))->numeric()->minValue(0)->maxValue(1)->default($v)->required())->values()->all(), Select::make('configuration.preset')->label('Lighting preset')->options(['studio' => __('Studio'), 'neutral' => __('Neutral')])->default('studio')->required(), TextEntry::make('preview_information')->label('Preview information')->state(__('Saved configuration is used by the public product viewer. Live draft 3D preview is not available.'))->columnSpanFull()])->columns(3)->columnSpanFull()];
    }

    private static function settings(): array
    {
        return [Section::make(__('Brand & contact'))->schema([TextInput::make('brand_name')->required()->maxLength(150), self::media('logo_id', 'Logo'), self::media('favicon_id', 'Favicon'), TextInput::make('phone')->tel()->maxLength(40), TextInput::make('whatsapp')->tel()->maxLength(30), TextInput::make('email')->email(), Textarea::make('address')->maxLength(500), TextInput::make('instagram')->url(), TextInput::make('linkedin')->url(), Toggle::make('contacts_visible')->helperText(__('Enable only after contact details are approved.')), Toggle::make('public_enabled')->helperText(__('Master visibility for the public API and website.'))])->columns(2)->columnSpanFull(), Tabs::make('Default SEO')->tabs(collect(['fr' => 'Français', 'en' => 'English', 'ar' => 'العربية'])->map(fn ($label, $locale) => Tab::make($label)->schema([TextInput::make("seo.$locale.title")->maxLength(200)->extraInputAttributes(['dir' => $locale === 'ar' ? 'rtl' : 'ltr']), Textarea::make("seo.$locale.description")->maxLength(500)->extraInputAttributes(['dir' => $locale === 'ar' ? 'rtl' : 'ltr'])]))->values()->all())->columnSpanFull()];
    }

    private static function quote(): array
    {
        return [Section::make(__('Private quotation record'))->schema([TextEntry::make('reference'), TextEntry::make('customer_name'), TextEntry::make('email'), TextEntry::make('phone'), TextEntry::make('delivery_country'), TextEntry::make('delivery_location'), TextEntry::make('project_description'), TextEntry::make('privacy_acknowledged_at')->dateTime(), TextEntry::make('submitted_at')->dateTime(), Select::make('status')->options(['new' => __('New'), 'in_review' => __('In review'), 'replied' => __('Replied'), 'closed' => __('Closed')])->required(), Select::make('assigned_to')->label('Assigned administrator')->options(fn () => User::where('active', true)->pluck('name', 'id')), Textarea::make('internal_notes')->maxLength(20000)->columnSpanFull()])->columns(2)->columnSpanFull(), Section::make(__('Immutable item snapshots'))->schema([RepeatableEntry::make('items')->schema([TextEntry::make('product_snapshot.name')->label('Product at submission'), TextEntry::make('finish_snapshot.name')->label('Finish'), TextEntry::make('format_snapshot.name')->label('Format'), TextEntry::make('width')->label('Width (cm)'), TextEntry::make('height')->label('Height (cm)'), TextEntry::make('thickness')->label('Thickness (cm)'), TextEntry::make('quantity'), TextEntry::make('unit'), TextEntry::make('configuration_snapshot')->formatStateUsing(fn ($state) => is_array($state) ? json_encode($state, JSON_UNESCAPED_UNICODE) : $state)->label('Saved configuration')])->columns(3), RepeatableEntry::make('statusEvents')->label('Status history')->schema([TextEntry::make('from_status')->formatStateUsing(fn ($state) => $state ? __(ucfirst(str_replace('_', ' ', $state))) : null), TextEntry::make('to_status')->formatStateUsing(fn ($state) => __(ucfirst(str_replace('_', ' ', $state)))), TextEntry::make('created_at')->dateTime()])->columns(3)])->columnSpanFull()];
    }
}
