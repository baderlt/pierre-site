<?php

namespace App\Models;

class Page extends ContentModel
{
    protected $table = 'pages';

    protected $fillable = ['slug', 'status', 'og_image_id', 'published_at'];

    protected function casts(): array
    {
        return ['published_at' => 'datetime'];
    }

    public function translations()
    {
        return $this->hasMany(PageTranslation::class, 'page_id');
    }

    public function sections()
    {
        return $this->hasMany(PageSection::class)->orderBy('sort_order');
    }
}
