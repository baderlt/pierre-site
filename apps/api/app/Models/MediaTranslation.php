<?php

namespace App\Models;

class MediaTranslation extends ContentModel
{
    protected $table = 'media_translations';

    protected $fillable = ['locale', 'name', 'description', 'seo_title', 'seo_description', 'cta_label'];
}
