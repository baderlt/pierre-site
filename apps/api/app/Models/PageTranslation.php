<?php

namespace App\Models;

class PageTranslation extends ContentModel
{
    protected $table = 'page_translations';

    protected $fillable = ['locale', 'name', 'description', 'seo_title', 'seo_description', 'cta_label'];
}
