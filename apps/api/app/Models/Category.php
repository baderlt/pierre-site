<?php

namespace App\Models;

class Category extends ContentModel
{
    protected $table = 'categories';

    protected $fillable = ['slug', 'active', 'sort_order', 'image_id'];

    protected function casts(): array
    {
        return ['active' => 'boolean'];
    }

    public function translations()
    {
        return $this->hasMany(CategoryTranslation::class, 'category_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
