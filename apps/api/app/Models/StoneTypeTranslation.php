<?php

namespace App\Models;

class StoneTypeTranslation extends ContentModel
{
    protected $table = 'stone_type_translations';

    protected $fillable = ['locale', 'name', 'description', 'seo_title', 'seo_description', 'cta_label'];
}
