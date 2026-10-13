<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuotationStatusEvent extends Model
{
    public const UPDATED_AT = null;

    protected $fillable = ['user_id', 'from_status', 'to_status'];

    public function quotationRequest()
    {
        return $this->belongsTo(QuotationRequest::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
