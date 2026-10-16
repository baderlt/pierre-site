<?php

namespace App\Filament\Resources;

use App\Domain\MediaLibrary;
use App\Filament\AdminSchemas;
use App\Models\Media;
use App\Models\Category;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\Product;
use App\Models\QuotationRequest;
use App\Models\SiteSetting;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

abstract class ContentResource extends Resource
{
    public static function getNavigationLabel(): string
    {
        return __(static::$navigationLabel ?? parent::getNavigationLabel());
    }

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        $group = parent::getNavigationGroup();

        return is_string($group) ? __($group) : $group;
    }

    public static function getPluralModelLabel(): string
    {
        return static::getNavigationLabel();
    }

    public static function getModelLabel(): string
    {
        return __([
            'Category' => 'Category', 'StoneType' => 'Material', 'Product' => 'Product',
            'Finish' => 'Finish', 'Color' => 'Color', 'Format' => 'Format',
            'Application' => 'Application', 'Media' => 'Media', 'Page' => 'Page',
            'PageSection' => 'Page section', 'QuotationRequest' => 'Quotation',
            'SiteSetting' => 'Website settings', 'User' => 'Administrator',
        ][class_basename(static::getModel())]);
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components(AdminSchemas::fields(static::getModel()));
    }

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();
        $model = new (static::getModel());
        if (method_exists($model, 'translations')) {
            $query->with('translations');
        }
        if ($model instanceof QuotationRequest) {
            $query->with(['items', 'statusEvents']);
        }
        if ($model instanceof PageSection) {
            $query->with(['page.translations', 'image']);
        }
        if ($model instanceof Product) {
            $query->with('mainImage');
        } elseif ($model instanceof Category) {
            $query->with('image');
        }

        return $query;
    }

    public static function table(Table $table): Table
    {
        $class = static::getModel();
        $model = new $class;
        $columns = [];
        $filters = [];
        if ($class === Media::class) {
            $columns = [ImageColumn::make('thumbnail')->getStateUsing(fn (Media $record) => $record->url('thumb'))->imageHeight(48)->extraImgAttributes(fn (Media $record) => ['alt' => __('Edit media').': '.($record->label(app()->getLocale()) ?: $record->original_filename)]), TextColumn::make('original_filename')->searchable()->sortable(), TextColumn::make('purpose')->formatStateUsing(fn ($state) => __(ucfirst($state)))->badge(), TextColumn::make('width')->label('Width px'), TextColumn::make('bytes')->numeric()];
        } elseif ($class === User::class) {
            $columns = [TextColumn::make('name')->searchable(), TextColumn::make('email')->searchable(), TextColumn::make('role')->formatStateUsing(fn ($state) => __($state === 'super_admin' ? 'Super Admin' : 'Content Manager'))->badge(), TextColumn::make('active')->formatStateUsing(fn ($state) => $state ? __('Active') : __('Inactive'))];
        } elseif ($class === QuotationRequest::class) {
            $columns = [TextColumn::make('reference')->searchable(), TextColumn::make('customer_name')->searchable(), TextColumn::make('email')->searchable(), TextColumn::make('status')->formatStateUsing(fn ($state) => __(ucfirst(str_replace('_', ' ', $state))))->badge()->sortable(), TextColumn::make('submitted_at')->dateTime()->sortable()];
            $filters = [SelectFilter::make('status')->options(['new' => __('New'), 'in_review' => __('In review'), 'replied' => __('Replied'), 'closed' => __('Closed')]), Filter::make('submitted_at')->schema([DatePicker::make('from'), DatePicker::make('until')])->query(fn (Builder $query, array $data) => $query->when($data['from'] ?? null, fn ($q, $d) => $q->whereDate('submitted_at', '>=', $d))->when($data['until'] ?? null, fn ($q, $d) => $q->whereDate('submitted_at', '<=', $d)))];
        } elseif ($class === SiteSetting::class) {
            $columns = [TextColumn::make('brand_name'), TextColumn::make('public_enabled')->formatStateUsing(fn ($state) => $state ? __('API enabled') : __('API hidden'))];
        } else {
            $columns = [TextColumn::make(in_array('slug', $model->getFillable()) ? 'slug' : 'key')->searchable()->sortable(), TextColumn::make('localized_name')->label('Title')->getStateUsing(fn ($record) => $record->label(app()->getLocale()))];
            if (in_array('status', $model->getFillable())) {
                $columns[] = TextColumn::make('status')->formatStateUsing(fn ($state) => __(ucfirst(str_replace('_', ' ', $state))))->badge()->sortable();
                $filters[] = SelectFilter::make('status')->options(['draft' => __('Draft'), 'published' => __('Published')]);
            }
            if (in_array('sort_order', $model->getFillable())) {
                $columns[] = TextColumn::make('sort_order')->sortable();
            }
        }
        $columns[] = TextColumn::make('updated_at')->dateTime()->sortable()->toggleable();
        if (in_array($class, [Product::class, Category::class], true)) {
            array_unshift($columns, ImageColumn::make('image_preview')->label('Image')->getStateUsing(fn (Model $record) => ($record instanceof Product ? $record->mainImage : $record->image)?->url('thumb'))->imageHeight(48)->imageWidth(64)->extraImgAttributes(fn (Model $record) => ['alt' => $record->label(app()->getLocale()), 'style' => 'object-fit:contain']));
        }
        if ($class === PageSection::class) {
            array_unshift($columns, ImageColumn::make('image_preview')->label('Image')->getStateUsing(fn (PageSection $record) => $record->image?->url('thumb'))->imageHeight(56), TextColumn::make('page.slug')->label('Page')->getStateUsing(fn (PageSection $record) => $record->page?->slug.' · '.($record->page?->label(app()->getLocale()) ?? '')));
            $filters[] = SelectFilter::make('page_id')->label('Page')->options(fn () => Page::with('translations')->get()->mapWithKeys(fn ($page) => [$page->id => $page->slug.' · '.($page->label(app()->getLocale()) ?? '')]));
            $filters[] = Filter::make('banners')->label('Images and banners')->query(fn (Builder $query) => $query->where(fn ($q) => $q->whereNotNull('image_id')->orWhere('type', 'hero')));
        }
        $actions = [EditAction::make()];
        if ($class === Media::class) {
            $actions[] = Action::make('usage')->label(__('Where is this image used?'))->icon('heroicon-o-map')->authorize(fn (Media $record) => Gate::allows('view', $record))->modalHeading(__('Image locations'))->modalContent(fn (Media $record) => view('admin.media-usage', ['media' => $record, 'locations' => app(MediaLibrary::class)->locations($record)]))->modalSubmitAction(false)->modalCancelActionLabel(__('Close'));
        }
        if ($class === Product::class) {
            $actions[] = Action::make('preview')->label(__('Preview information'))->icon('heroicon-o-eye')->modalHeading(__('Saved product information'))->modalContent(fn (Product $record) => view('admin.product-preview', ['product' => $record->load(['translations', 'configuration', 'finishes.translations', 'formats', 'mainImage'])]))->modalSubmitAction(false)->modalCancelActionLabel(__('Close'));
        }
        $actions[] = DeleteAction::make()->using(function (Model $record): bool {
            Gate::authorize('delete', $record);
            if ($record instanceof Media) {
                app(MediaLibrary::class)->remove($record);
            } else {
                try {
                    DB::transaction(fn () => $record->delete());
                } catch (QueryException $e) {
                    if (in_array($e->getCode(), ['23000', '23503'])) {
                        throw ValidationException::withMessages(['record' => __('This record is referenced. Reassign its relationships before deleting.')]);
                    } throw $e;
                }
            }

            return true;
        });

        return $table->columns($columns)->filters($filters)->recordActions($actions)->defaultSort('updated_at', 'desc')->paginated([10, 25, 50]);
    }
}
