<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $locale = $request->input('locale', 'fr');
        $data = ['id' => (string) $this->id, 'slug' => $this->slug, 'name' => $this->label($locale), 'description' => $this->label($locale, 'description'), 'category' => $this->category->slug, 'stone_type' => $this->stoneType->slug, 'finish' => $this->finishes->where('active', true)->pluck('slug')->values()->all(), 'color' => $this->colors->where('active', true)->pluck('slug')->values()->all(), 'application' => $this->applications->filter(fn ($a) => $a->status === 'published' && $a->published_at?->lte(now()) && (app()->environment(['local', 'testing']) || ! $a->illustrative))->pluck('slug')->values()->all(), 'image' => $this->mainImage?->url(), 'image_alt' => $this->mainImage?->label($locale) ?: $this->label($locale), 'temporary' => $this->illustrative, 'seo' => ['title' => $this->label($locale, 'seo_title'), 'description' => $this->label($locale, 'seo_description'), 'image' => $this->ogImage?->url()]];
        $data['commercial_finishes'] = $data['finish'];
        $data['colors'] = $data['color'];
        $data['applications'] = $data['application'];
        $data['finish'] = $data['finish'][0] ?? null;
        $data['color'] = $data['color'][0] ?? null;
        $data['application'] = $data['application'][0] ?? null;
        if ($request->routeIs('api.products.show')) {
            $config = $this->configuration;
            $dims = fn ($source) => ['width' => (float) $source->width, 'height' => (float) $source->height, 'thickness' => (float) $source->thickness];
            $data += ['images' => collect([['src' => $this->mainImage?->url(), 'alt' => $this->mainImage?->label($locale) ?: $this->label($locale), 'role' => 'studio', 'temporary' => $this->illustrative], ['src' => $this->texture?->url('texture'), 'alt' => $this->texture?->label($locale) ?: $this->label($locale), 'role' => 'texture', 'temporary' => $this->illustrative]])->merge($this->gallery->map(fn ($m) => ['src' => $m->url(), 'alt' => $m->label($locale) ?: $this->label($locale), 'role' => 'application', 'temporary' => $this->illustrative]))->filter(fn ($m) => $m['src'] !== null)->values()->all(),
                'texture' => $this->texture ? ['src' => $this->texture->url('texture'), 'max_resolution' => 2048, 'temporary' => $this->illustrative] : null,
                'geometry_type' => $config?->geometry, 'dimensions_cm' => $config ? $dims($config) : null, 'dimensions_verified' => $config?->dimensions_verified ?? false,
                'finish_options' => $this->finishes->where('active', true)->map(fn ($f) => ['id' => (string) $f->id, 'slug' => $f->slug, 'name' => $f->label($locale), 'simulation' => $f->simulation])->values()->all(),
                'supported_finishes' => $this->finishes->where('active', true)->pluck('simulation')->filter()->unique()->values()->all(),
                'formats' => $this->formats->where('active', true)->map(fn ($f) => ['id' => (string) $f->id, 'name' => $f->label($locale), 'geometry' => $f->geometry, 'dimensions_cm' => $dims($f->pivot), 'verified' => (bool) $f->pivot->verified, 'allow_custom' => (bool) $f->pivot->allow_custom])->values()->all(),
                'uploaded_model' => null, 'saved_3d_configuration' => $config ? ['version' => 1, 'shape' => $config->geometry, 'finish' => $config->finish, 'scale' => (float) $config->scale, 'rotation' => (float) $config->rotation, ...$dims($config)] : null,
                'material_parameters' => $config ? ['roughness' => (float) $config->roughness, 'metalness' => (float) $config->metalness, 'bump_strength' => (float) $config->bump_strength, 'preset' => $config->preset] : null,
                'verified_specifications' => []];
        }

        return $data;
    }
}
