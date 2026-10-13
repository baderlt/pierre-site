<?php

namespace App\Models;

class ProductTranslation extends ContentModel
{
    protected $table = 'product_translations';

    protected $fillable = ['locale', 'name', 'description', 'seo_title', 'seo_description', 'cta_label'];
}
