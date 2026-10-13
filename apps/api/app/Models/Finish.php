<?php

namespace App\Models;

class Finish extends ContentModel
{
    protected $table = 'finishes';

    protected $fillable = ['slug', 'active', 'sort_order', 'image_id', 'simulation'];

    protected function casts(): array
    {
        return ['active' => 'boolean'];
    }

    public function translations()
    {
        return $this->hasMany(FinishTranslation::class, 'finish_id');
    }
}
