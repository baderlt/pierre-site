<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

abstract class ContentModel extends Model
{
    use HasFactory;

    public function image()
    {
        return $this->belongsTo(Media::class, 'image_id');
    }

    public function ogImage()
    {
        return $this->belongsTo(Media::class, 'og_image_id');
    }

    protected static function booted(): void
    {
        foreach (['saved', 'deleted'] as $event) {
            static::$event(fn () => DB::afterCommit(fn () => Cache::forever('public-content-version', (string) Str::uuid())));
        }
    }

    public function label(string $locale = 'fr', string $field = 'name'): ?string
    {
        $translations = $this->translations;

        return $translations->firstWhere('locale', $locale)?->$field ?: $translations->firstWhere('locale', 'fr')?->$field;
    }

    /** Locale eligibility never treats French fallback as a completed translation. */
    public function seoLocales(): array
    {
        $french = $this->translations->firstWhere('locale', 'fr');
        $fields = array_filter(['name', 'description', 'seo_title', 'seo_description', 'cta_label'], fn ($field) => filled($french?->$field));

        return array_values(array_filter(['fr', 'en', 'ar'], function ($locale) use ($fields) {
            $translation = $this->translations->firstWhere('locale', $locale);
            return filled($translation?->name) && collect($fields)->every(fn ($field) => filled($translation?->$field));
        }));
    }

    public function scopePublished($q)
    {
        if (app()->isProduction() && in_array($this->getTable(), ['products', 'applications'])) {
            $q->where('illustrative', false);
        }

        return $q->where('status', 'published')->whereNotNull('published_at')->where('published_at', '<=', now());
    }
}
