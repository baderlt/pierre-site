<?php

namespace App\Models;

class ApplicationTranslation extends ContentModel
{
    protected $table = 'application_translations';

    protected $fillable = ['locale', 'name', 'description', 'seo_title', 'seo_description', 'cta_label'];
}
