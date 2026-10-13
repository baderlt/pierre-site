<?php

namespace App\Models;

class PageSection extends ContentModel
{
    protected $table = 'page_sections';

    protected $fillable = ['page_id', 'type', 'key', 'link_path', 'visible', 'image_id', 'sort_order'];

    protected function casts(): array
    {
        return ['visible' => 'boolean'];
    }

    public function translations()
    {
        return $this->hasMany(PageSectionTranslation::class, 'page_section_id');
    }

    public function page()
    {
        return $this->belongsTo(Page::class);
    }
}
