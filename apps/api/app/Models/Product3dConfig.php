<?php

namespace App\Models;

class Product3dConfig extends ContentModel
{
    protected $table = 'product_3d_configs';

    protected $fillable = ['version', 'geometry', 'width', 'height', 'thickness', 'dimensions_verified', 'finish', 'scale', 'rotation', 'roughness', 'metalness', 'bump_strength', 'preset'];

    protected function casts(): array
    {
        return ['dimensions_verified' => 'boolean'];
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
