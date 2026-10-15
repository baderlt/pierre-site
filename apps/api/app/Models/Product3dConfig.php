<?php

namespace App\Models;

class Product3dConfig extends ContentModel
{
    protected $table = 'product_3d_configs';

    protected $fillable = ['version', 'geometry', 'width', 'height', 'thickness', 'dimensions_verified', 'finish', 'scale', 'rotation', 'roughness', 'metalness', 'bump_strength', 'preset', 'source', 'shape', 'shape_parameters', 'parameter_limits', 'customer_dimensions', 'model_media_id', 'model_approved', 'top_media_id', 'bottom_media_id', 'side_media_id', 'edge_finish'];

    protected function casts(): array
    {
        return ['dimensions_verified' => 'boolean', 'customer_dimensions' => 'boolean', 'model_approved' => 'boolean', 'shape_parameters' => 'array', 'parameter_limits' => 'array'];
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function modelMedia() { return $this->belongsTo(Media::class, 'model_media_id'); }
    public function topMedia() { return $this->belongsTo(Media::class, 'top_media_id'); }
    public function bottomMedia() { return $this->belongsTo(Media::class, 'bottom_media_id'); }
    public function sideMedia() { return $this->belongsTo(Media::class, 'side_media_id'); }
}
