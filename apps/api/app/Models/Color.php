<?php

namespace App\Models;

class Color extends ContentModel
{
    protected $table = 'colors';

    protected $fillable = ['slug', 'active', 'sort_order', 'image_id', 'swatch'];

    protected function casts(): array
    {
        return ['active' => 'boolean'];
    }

    public function translations()
    {
        return $this->hasMany(ColorTranslation::class, 'color_id');
    }
}
