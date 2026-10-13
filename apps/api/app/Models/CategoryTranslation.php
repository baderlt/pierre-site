<?php

namespace App\Models;

class CategoryTranslation extends ContentModel
{
    protected $table = 'category_translations';

    protected $fillable = ['locale', 'name', 'description', 'seo_title', 'seo_description', 'cta_label'];
}
