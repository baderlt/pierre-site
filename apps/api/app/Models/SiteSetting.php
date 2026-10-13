<?php

namespace App\Models;

class SiteSetting extends ContentModel
{
    protected $fillable = ['brand_name', 'logo_id', 'favicon_id', 'phone', 'whatsapp', 'email', 'address', 'instagram', 'linkedin', 'contacts_visible', 'public_enabled', 'seo'];

    protected function casts(): array
    {
        return ['seo' => 'array', 'contacts_visible' => 'boolean', 'public_enabled' => 'boolean'];
    }

    public function logo()
    {
        return $this->belongsTo(Media::class, 'logo_id');
    }

    public function favicon()
    {
        return $this->belongsTo(Media::class, 'favicon_id');
    }
}
