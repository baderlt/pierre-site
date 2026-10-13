<?php

namespace App\Models;

class ColorTranslation extends ContentModel
{
    protected $table = 'color_translations';

    protected $fillable = ['locale', 'name', 'description', 'seo_title', 'seo_description', 'cta_label'];
}
