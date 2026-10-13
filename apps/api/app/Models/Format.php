<?php

namespace App\Models;

class Format extends ContentModel
{
    protected $table = 'formats';

    protected $fillable = ['slug', 'active', 'sort_order', 'image_id', 'geometry'];

    protected function casts(): array
    {
        return ['active' => 'boolean'];
    }

    public function translations()
    {
        return $this->hasMany(FormatTranslation::class, 'format_id');
    }
}
