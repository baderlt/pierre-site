<?php

namespace App\Domain;

use App\Models\Product;
use Illuminate\Validation\ValidationException;

class ViewerConfiguration
{
    public function public(Product $product): ?array
    {
        $c = $product->configuration;
        if (! $product->viewer_enabled || ! $c) return null;
        try {
            if (! $product->finishes->contains(fn ($f) => $f->active && $f->simulation === $c->finish)
                || ! $product->formats->contains(fn ($f) => $f->active && $f->geometry === $c->geometry)) return null;
            $base = ['revision' => (int) $c->revision, 'source' => $c->source, 'shape' => $c->shape ?: $c->geometry, 'customizable' => (bool) $c->customer_dimensions];
            if ($c->source === 'glb') {
                $m = $c->modelMedia;$meta = $m?->derivatives['model'] ?? null;
                if (! $c->model_approved || $c->customer_dimensions || ! $m || $m->asset_type !== 'model' || $m->processing_status !== 'ready' || ($meta['validator_version'] ?? null) !== 1 || ! preg_match('/^[a-f0-9]{64}$/', $meta['sha256'] ?? '')) return null;
                return [...$base, 'shape' => 'model', 'parameters' => [], 'limits' => [], 'model' => ['url' => $m->url('model'), 'bytes' => $meta['bytes'], 'sha256' => $meta['sha256'], 'validated' => true, 'mime' => 'model/gltf-binary', 'dimensions_cm' => $meta['dimensions_cm']], 'materials' => [], 'edge_finish' => 'original'];
            }
            if ($c->source !== 'procedural' || ! $product->texture || $product->texture->processing_status !== 'ready' || $product->texture->asset_type !== 'image') return null;
            $parameters = $c->shape_parameters ?: $c->only(['width', 'height', 'thickness']);
            $geometry = app(StoneGeometry::class);$parameters = $geometry->parameters($base['shape'], $parameters);
            $configuredLimits = $c->parameter_limits ?? [];
            if ($c->customer_dimensions && ! $c->shape && ! $configuredLimits) {
                foreach ($parameters as $key => $value) $configuredLimits[$key] = ['min' => .5, 'max' => 500, 'step' => .1, 'default' => $value];
            }
            $limits = $c->customer_dimensions ? $geometry->limits($base['shape'], $parameters, $configuredLimits) : [];
            $materials = [];
            foreach (['top', 'bottom', 'side'] as $face) {
                $m = $c->{$face.'Media'};
                if ($m && ($m->asset_type !== 'image' || $m->processing_status !== 'ready')) return null;
                $materials[$face] = ($m ?? $product->texture)->url('texture');
            }
            return [...$base, 'parameters' => $parameters, 'limits' => $limits, 'model' => null, 'materials' => $materials, 'edge_finish' => $c->edge_finish];
        } catch (ValidationException) { return null; }
    }

    public function selection(Product $product, array $selection): array
    {
        $v = $this->public($product);
        $fail = fn () => throw ValidationException::withMessages(['geometry' => 'The selected 3D configuration is unavailable, changed or outside its approved limits.']);
        if (! $v || ($selection['revision'] ?? null) !== $v['revision'] || ($selection['source'] ?? null) !== $v['source'] || ($selection['shape'] ?? null) !== $v['shape'] || ($selection['version'] ?? null) !== 2) $fail();
        $params = $selection['parameters'] ?? [];
        if ($v['source'] === 'glb') {if ($params !== []) $fail();$dimensions = $v['model']['dimensions_cm'];}
        else {$params = app(StoneGeometry::class)->parameters($v['shape'], $params, $v['customizable'] ? $v['limits'] : [], $v['parameters']);$dimensions = app(StoneGeometry::class)->dimensions($v['shape'], $params);}
        $materials=[];if($v['source']==='procedural')foreach(['top','bottom','side']as$face){$m=$product->configuration->{$face.'Media'}??$product->texture;$materials[$face.'_media_id']=$m?(string)$m->id:null;$materials[$face.'_derivative']=$m?($m->derivatives['texture']??null):null;}
        return ['version' => 2, 'revision' => $v['revision'], 'source' => $v['source'], 'shape' => $v['shape'], 'parameters' => $params, 'dimensions_cm' => $dimensions, 'model_media_id'=>$v['source']==='glb'?(string)$product->configuration->model_media_id:null,'model_sha256' => $v['model']['sha256'] ?? null, 'material_media_ids' => $materials, 'edge_finish' => $v['edge_finish']];
    }
}
