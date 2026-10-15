<?php

namespace App\Models;

use App\Domain\MediaLibrary;

class Media extends ContentModel
{
    protected $attributes = ['asset_type' => 'image'];
    protected $table = 'media';

    protected $fillable = ['original_filename', 'disk', 'path', 'mime', 'bytes', 'width', 'height', 'purpose', 'processing_status', 'derivatives', 'uploaded_at', 'asset_type'];

    protected function casts(): array
    {
        return ['derivatives' => 'array', 'uploaded_at' => 'datetime'];
    }

    public function translations()
    {
        return $this->hasMany(MediaTranslation::class, 'media_id');
    }

    public function url(string $variant = 'preview'): string
    {
        return url('/media/'.$this->id.'/'.$variant);
    }

    public function isPubliclyReferenced(): bool
    {
        return app(MediaLibrary::class)->isPublic($this);
    }

    public function bannerUrl(): string
    {
        return $this->url(isset($this->derivatives['banner']) ? 'banner' : (isset($this->derivatives['texture']) ? 'texture' : 'preview'));
    }
}
