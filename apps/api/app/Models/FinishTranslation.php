<?php

namespace App\Models;

class FinishTranslation extends ContentModel
{
    protected $table = 'finish_translations';

    protected $fillable = ['locale', 'name', 'description', 'seo_title', 'seo_description', 'cta_label'];
}
