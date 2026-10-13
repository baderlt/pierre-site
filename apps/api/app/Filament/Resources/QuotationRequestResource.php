<?php

namespace App\Filament\Resources;

use App\Models\QuotationRequest;

class QuotationRequestResource extends ContentResource
{
    protected static ?string $model = QuotationRequest::class;

    protected static ?string $navigationLabel = 'Quotations';

    protected static string|\UnitEnum|null $navigationGroup = 'Enquiries';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-squares-2x2';

    public static function getPages(): array
    {
        return ['index' => QuotationRequestResource\ListQuotationRequest::route('/'), 'create' => QuotationRequestResource\CreateQuotationRequest::route('/create'), 'edit' => QuotationRequestResource\EditQuotationRequest::route('/{record}/edit')];
    }
}
