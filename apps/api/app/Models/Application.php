<?php

namespace App\Models;

class Application extends ContentModel
{
    protected $table = 'applications';

    protected $fillable = ['slug', 'status', 'image_id', 'illustrative', 'sort_order', 'published_at'];

    protected function casts(): array
    {
        return ['illustrative' => 'boolean', 'published_at' => 'datetime'];
    }

    public function translations()
    {
        return $this->hasMany(ApplicationTranslation::class, 'application_id');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'application_product');
    }

    public function gallery()
    {
        return $this->belongsToMany(Media::class, 'application_media')->withPivot('sort_order')->orderByPivot('sort_order');
    }
}
