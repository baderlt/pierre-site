<?php

namespace App\Models;

class StoneType extends ContentModel
{
    protected $table = 'stone_types';

    protected $fillable = ['slug', 'active', 'sort_order', 'image_id', 'classification', 'internal_notes'];

    protected function casts(): array
    {
        return ['active' => 'boolean'];
    }

    public function translations()
    {
        return $this->hasMany(StoneTypeTranslation::class, 'stone_type_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function finishes()
    {
        return $this->belongsToMany(Finish::class, 'stone_type_finish');
    }

    public function colors()
    {
        return $this->belongsToMany(Color::class, 'stone_type_color');
    }

    public function media()
    {
        return $this->belongsToMany(Media::class, 'stone_type_media');
    }
}
