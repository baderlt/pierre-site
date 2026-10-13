<?php

namespace App\Models;

class FormatTranslation extends ContentModel
{
    protected $table = 'format_translations';

    protected $fillable = ['locale', 'name', 'description', 'seo_title', 'seo_description', 'cta_label'];
}
