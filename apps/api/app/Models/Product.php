<?php

namespace App\Models;

class Product extends ContentModel
{
    protected $table = 'products';

    protected $fillable = ['slug', 'sku', 'category_id', 'stone_type_id', 'status', 'featured', 'sort_order', 'illustrative', 'main_image_id', 'texture_id', 'og_image_id', 'published_at', 'viewer_enabled'];

    protected function casts(): array
    {
        return ['featured' => 'boolean', 'illustrative' => 'boolean', 'published_at' => 'datetime', 'viewer_enabled' => 'boolean'];
    }

    public function translations()
    {
        return $this->hasMany(ProductTranslation::class, 'product_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function stoneType()
    {
        return $this->belongsTo(StoneType::class);
    }

    public function finishes()
    {
        return $this->belongsToMany(Finish::class, 'product_finish');
    }

    public function colors()
    {
        return $this->belongsToMany(Color::class, 'product_color');
    }

    public function formats()
    {
        return $this->belongsToMany(Format::class, 'product_formats')->withPivot('width', 'height', 'thickness', 'verified', 'allow_custom');
    }

    public function applications()
    {
        return $this->belongsToMany(Application::class, 'application_product');
    }

    public function gallery()
    {
        return $this->belongsToMany(Media::class, 'product_media')->withPivot('sort_order')->orderByPivot('sort_order');
    }

    public function configuration()
    {
        return $this->hasOne(Product3dConfig::class);
    }

    public function mainImage()
    {
        return $this->belongsTo(Media::class, 'main_image_id');
    }

    public function texture()
    {
        return $this->belongsTo(Media::class, 'texture_id');
    }

    public function scopePublicCatalogue($q)
    {
        return $q->published()->whereHas('category', fn ($q) => $q->where('active', true))->whereHas('stoneType', fn ($q) => $q->where('active', true));
    }
}
