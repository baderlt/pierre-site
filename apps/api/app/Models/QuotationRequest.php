<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuotationRequest extends Model
{
    use HasFactory;

    protected $fillable = ['uuid', 'reference', 'locale', 'customer_name', 'email', 'phone', 'delivery_country', 'delivery_location', 'project_description', 'privacy_acknowledged_at', 'submitted_at', 'status', 'internal_notes', 'assigned_to'];

    protected function casts(): array
    {
        return ['privacy_acknowledged_at' => 'datetime', 'submitted_at' => 'datetime'];
    }

    public function items()
    {
        return $this->hasMany(QuotationItem::class);
    }

    public function statusEvents()
    {
        return $this->hasMany(QuotationStatusEvent::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
