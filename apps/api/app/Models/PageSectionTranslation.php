<?php

namespace App\Models;

class PageSectionTranslation extends ContentModel
{
    protected $table = 'page_section_translations';

    protected $fillable = ['locale', 'name', 'description', 'seo_title', 'seo_description', 'cta_label'];
}
