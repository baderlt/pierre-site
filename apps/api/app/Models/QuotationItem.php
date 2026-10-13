<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

class QuotationItem extends Model
{
    protected $fillable = ['product_id', 'product_snapshot', 'finish_snapshot', 'format_snapshot', 'configuration_snapshot', 'width', 'height', 'thickness', 'quantity', 'unit', 'custom_dimensions_requested'];

    protected function casts(): array
    {
        return ['product_snapshot' => 'array', 'finish_snapshot' => 'array', 'format_snapshot' => 'array', 'configuration_snapshot' => 'array', 'custom_dimensions_requested' => 'boolean'];
    }

    protected static function booted(): void
    {
        static::updating(fn () => throw ValidationException::withMessages(['items' => 'Quotation snapshots are immutable.']));
    }

    public function quotationRequest()
    {
        return $this->belongsTo(QuotationRequest::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
