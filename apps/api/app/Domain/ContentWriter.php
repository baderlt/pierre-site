<?php

namespace App\Domain;

use App\Models\Application;
use App\Models\Color;
use App\Models\Finish;
use App\Models\Format;
use App\Models\Media;
use App\Models\PageSection;
use App\Models\Product;
use App\Models\QuotationRequest;
use App\Models\SiteSetting;
use App\Models\StoneType;
use App\Models\User;
use App\Rules\GoogleMapsLocation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/** Shared validation and transactions for Filament; no public write API. */
class ContentWriter
{
    public function save(string $class, array $data, ?Model $record = null): Model
    {
        Gate::authorize($record ? 'update' : 'create', $record ?? $class);
        if ($class === User::class) {
            return $this->user($data, $record);
        }
        if ($class === QuotationRequest::class) {
            return app(QuotationWorkflow::class)->update($record, $data);
        }
        if ($class === Media::class) {
            if ($record && $record->asset_type === 'model') {
                throw ValidationException::withMessages(['upload' => 'Manage validated GLB models in the product editor.']);
            }

            return $this->media($data, $record);
        }
        $model = $record ?? new $class;
        $rules = [];
        if ($class === SiteSetting::class) {
            $rules = ['brand_name' => 'required|string|max:150', 'phone' => 'nullable|regex:/^\+?[0-9 ()-]{6,40}$/', 'whatsapp' => 'nullable|regex:/^\+?[1-9][0-9]{6,14}$/', 'email' => 'nullable|email|max:254', 'address' => 'nullable|string|max:500', 'instagram' => 'nullable|url:https|max:255', 'linkedin' => 'nullable|url:https|max:255', 'contacts_visible' => 'required|boolean', 'public_enabled' => 'required|boolean', 'seo' => 'required|array:fr,en,ar'];
            foreach (['fr', 'en', 'ar'] as $locale) {
                $rules["seo.$locale"] = 'required|array:title,description';
                $rules["seo.$locale.title"] = 'nullable|string|max:200';
                $rules["seo.$locale.description"] = 'nullable|string|max:500';
            }
            $rules['maps_directions_url'] = ['nullable', 'string', 'max:2048', new GoogleMapsLocation];
        } else {
            $rules = ['translations' => 'required|array:fr,en,ar'];
            foreach (['fr', 'en', 'ar'] as $locale) {
                $rules["translations.$locale"] = 'required|array:name,description,seo_title,seo_description,cta_label';
                $rules["translations.$locale.name"] = ($locale === 'fr' ? 'required' : 'nullable').'|string|max:200';
                foreach (['description' => 10000, 'seo_title' => 200, 'seo_description' => 500, 'cta_label' => 100] as $field => $max) {
                    $rules["translations.$locale.$field"] = "nullable|string|max:$max";
                }
            }
            if ($class !== PageSection::class) {
                $rules['slug'] = ['required', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', 'max:100', Rule::unique($model->getTable(), 'slug')->ignore($record?->id)];
            }
            if (in_array('status', $model->getFillable())) {
                $rules['status'] = 'required|in:draft,published';
                $rules['published_at'] = 'nullable|date';
            }
            foreach (['sort_order', 'active', 'featured', 'illustrative', 'visible'] as $field) {
                if (in_array($field, $model->getFillable())) {
                    $rules[$field] = in_array($field, ['sort_order']) ? 'required|integer|min:0|max:100000' : 'required|boolean';
                }
            }
        }
        foreach ($model->getFillable() as $field) {
            if (str_ends_with($field, '_id') && ! in_array($field, ['category_id', 'stone_type_id', 'page_id'])) {
                $rules[$field] = ['nullable', 'integer', Rule::exists('media', 'id')->where('asset_type', 'image')->where('processing_status', 'ready')];
            }
        }
        if ($class === Product::class) {
            $data['viewer_enabled'] ??= $record?->viewer_enabled ?? false;
            $enabled = filter_var($data['viewer_enabled'], FILTER_VALIDATE_BOOLEAN);
            if (! $enabled) {
                unset($data['configuration'], $data['model_upload']);
            } elseif (isset($data['configuration'])) {
                if (! is_array($data['configuration'])) {
                    throw ValidationException::withMessages(['configuration.source' => 'Invalid 3D configuration.']);
                }
                if (isset($data['configuration']['dimension_limits'])) {
                    if (! is_array($data['configuration']['dimension_limits'])) {
                        throw ValidationException::withMessages(['configuration.dimension_limits' => 'Invalid dimension limits.']);
                    }
                    $limits = [];
                    foreach ($data['configuration']['dimension_limits'] as $l) {
                        if (! is_array($l)) {
                            throw ValidationException::withMessages(['configuration.dimension_limits' => 'Invalid dimension limits.']);
                        }
                        $key = $l['parameter'] ?? '';
                        if (! is_string($key) || isset($limits[$key])) {
                            throw ValidationException::withMessages(['configuration.dimension_limits' => 'Each customer parameter must be unique.']);
                        }
                        unset($l['parameter']);
                        $limits[$key] = $l;
                    }
                    $data['configuration']['parameter_limits'] = $limits;
                    unset($data['configuration']['dimension_limits']);
                }
                if (isset($data['configuration']['shape_parameters']['vertices'])) {
                    if (! is_array($data['configuration']['shape_parameters']['vertices'])) {
                        throw ValidationException::withMessages(['configuration.shape' => 'Invalid polygon vertices.']);
                    }
                    $data['configuration']['shape_parameters']['vertices'] = array_map(fn ($p) => isset($p['x'], $p['y']) ? [(float) $p['x'], (float) $p['y']] : $p, $data['configuration']['shape_parameters']['vertices']);
                }
                foreach (['shape_parameters', 'parameter_limits'] as $key) {
                    if (is_string($data['configuration'][$key] ?? null)) {
                        try {
                            $data['configuration'][$key] = json_decode($data['configuration'][$key], true, 16, JSON_THROW_ON_ERROR);
                        } catch (\Throwable) {
                            throw ValidationException::withMessages(['configuration.'.$key => 'Invalid geometry JSON.']);
                        }
                    }
                    if (isset($data['configuration'][$key]) && ! is_array($data['configuration'][$key])) {
                        throw ValidationException::withMessages(['configuration.source' => 'Invalid geometry parameters.']);
                    }
                }
                $data['configuration'] += ['source' => 'procedural', 'shape' => null, 'shape_parameters' => null, 'parameter_limits' => [], 'customer_dimensions' => false, 'model_approved' => false, 'edge_finish' => 'same'];
                if ($data['configuration']['source'] === 'procedural') {
                    $shape = $data['configuration']['shape'] ?: ($data['configuration']['geometry'] ?? 'slab');
                    if (! is_string($shape)) {
                        throw ValidationException::withMessages(['configuration.shape' => 'Invalid geometry shape.']);
                    }
                    $parameters = $data['configuration']['shape_parameters'] ?: array_intersect_key($data['configuration'], array_flip(['width', 'height', 'thickness']));
                    $parameters = app(StoneGeometry::class)->parameters($shape, $parameters);
                    $limits = app(StoneGeometry::class)->limits($shape, $parameters, $data['configuration']['parameter_limits'] ?? []);
                    $data['configuration'] = [...$data['configuration'], ...app(StoneGeometry::class)->dimensions($shape, $parameters), 'shape_parameters' => $parameters, 'parameter_limits' => $limits];
                }
            }
            $rules += $this->productRules($record);
            if (! $enabled) {
                $rules = array_filter($rules, fn ($key) => ! str_starts_with($key, 'configuration'), ARRAY_FILTER_USE_KEY);
            }
            $rules['model_upload'] = 'nullable|file|max:8192';
        }
        foreach (['main_upload', 'texture_upload'] as $upload) {
            if (isset($data[$upload])) {
                $rules[$upload] = 'nullable|file|max:10240|mimetypes:image/jpeg,image/png,image/webp';
            }
        }
        if (isset($data['gallery_uploads'])) {
            $rules['gallery_uploads'] = 'array|max:12';
            $rules['gallery_uploads.*'] = 'file|max:10240|mimetypes:image/jpeg,image/png,image/webp';
        }
        if ($class === PageSection::class) {
            $rules['image_upload'] = 'nullable|file|max:10240|mimetypes:image/jpeg,image/png,image/webp';
            $rules += ['page_id' => 'required|exists:pages,id', 'key' => ['required', 'regex:/^[a-z0-9-]+$/', Rule::unique('page_sections', 'key')->where('page_id', $data['page_id'] ?? 0)->ignore($record?->id)], 'type' => 'required|in:hero,story,image_text,cta,navigation,footer,quality', 'link_path' => ['nullable', 'max:200', 'regex:~^/(?:fr|en|ar)(?:/[a-z0-9/#-]*)?$~']];
        }
        if ($class === StoneType::class) {
            $rules += ['classification' => 'nullable|string|max:80', 'internal_notes' => 'nullable|string|max:10000', 'finishes' => 'array', 'finishes.*' => 'integer|distinct|exists:finishes,id', 'colors' => 'array', 'colors.*' => 'integer|distinct|exists:colors,id', 'media' => 'array', 'media.*' => ['integer', 'distinct', Rule::exists('media', 'id')->where('asset_type', 'image')->where('processing_status', 'ready')]];
        }
        if ($class === Finish::class) {
            $rules['simulation'] = 'nullable|in:honed,polished,rough';
        }
        if ($class === Format::class) {
            $rules['geometry'] = 'required|in:slab,tile,block';
        }
        if ($class === Color::class) {
            $rules['swatch'] = 'required|regex:/^#[0-9a-fA-F]{6}$/';
        }
        if ($class === Application::class) {
            $rules += ['products' => 'array', 'products.*' => 'integer|distinct|exists:products,id', 'gallery' => 'array', 'gallery.*' => ['integer', 'distinct', Rule::exists('media', 'id')->where('asset_type', 'image')->where('processing_status', 'ready')]];
        }
        $validated = Validator::make($data, $rules)->validate();
        if ($class === Product::class) {
            $this->validateOptions($validated);
        }

        return DB::transaction(function () use ($model, $validated, $data, $class) {
            $attributes = array_intersect_key($validated, array_flip($model->getFillable()));
            if (($attributes['status'] ?? null) === 'published') {
                $attributes['published_at'] ??= now();
            }
            if (($attributes['status'] ?? null) === 'draft') {
                $attributes['published_at'] = null;
            }
            foreach (['main_upload' => 'main_image_id', 'texture_upload' => 'texture_id'] as $upload => $field) {
                if (! empty($data[$upload])) {
                    $attributes[$field] = app(MediaLibrary::class)->ingest($data[$upload], $upload === 'texture_upload' ? 'texture' : 'image')->id;
                }
            }
            $model->fill($attributes)->save();
            if ($class === PageSection::class && ! empty($data['image_upload'])) {
                $model->update(['image_id' => app(MediaLibrary::class)->ingest($data['image_upload'])->id]);
            }
            if (isset($validated['translations'])) {
                foreach ($validated['translations'] as $locale => $translation) {
                    if (empty($translation['name'])) {
                        $model->translations()->where('locale', $locale)->delete();

                        continue;
                    }
                    $model->translations()->updateOrCreate(['locale' => $locale], $translation);
                }
            }
            foreach (['finishes', 'colors', 'applications', 'products', 'media'] as $relation) {
                if (isset($validated[$relation])) {
                    $model->$relation()->sync($validated[$relation]);
                }
            }
            if (isset($validated['gallery'])) {
                $gallery = $validated['gallery'];
                foreach ($data['gallery_uploads'] ?? [] as $file) {
                    $gallery[] = app(MediaLibrary::class)->ingest($file)->id;
                }
                $model->gallery()->sync(collect($gallery)->unique()->values()->mapWithKeys(fn ($id, $i) => [$id => ['sort_order' => $i]])->all());
            }
            if ($class === Product::class) {
                if ($model->viewer_enabled) {
                    $config = $validated['configuration'];
                    if (! empty($validated['model_upload'])) {
                        $config['model_media_id'] = app(MediaLibrary::class)->ingestModel($validated['model_upload'])->id;
                    }
                    if ($config['source'] === 'glb') {
                        $asset = Media::where('asset_type', 'model')->where('processing_status', 'ready')->find($config['model_media_id'] ?? null);
                        if (! $asset || ! $config['model_approved'] || $config['customer_dimensions']) {
                            throw ValidationException::withMessages(['configuration.model_media_id' => 'Approve a validated GLB model. Custom GLB dimensions are not supported.']);
                        }
                        $config = [...$config, ...$asset->derivatives['model']['dimensions_cm'], 'shape_parameters' => null, 'parameter_limits' => []];
                    }
                    $existing = $model->configuration;
                    $saved = $model->configuration()->updateOrCreate([], $config);
                    if ($saved->wasRecentlyCreated || $saved->wasChanged()) {
                        $saved->forceFill(['revision' => ($existing?->revision ?? 0) + 1])->save();
                    }
                    $model->unsetRelation('configuration');
                }
                $formats = [];
                foreach ($validated['format_options'] as $format) {
                    $id = $format['format_id'];
                    unset($format['format_id']);
                    $formats[$id] = $format;
                }
                $model->formats()->sync($formats);
                $model->unsetRelation('formats');
                $model->unsetRelation('finishes');
                $model->unsetRelation('texture');
                if ($model->viewer_enabled && ! app(ViewerConfiguration::class)->public($model)) {
                    throw ValidationException::withMessages(['configuration.source' => 'Complete a valid 3D configuration and texture or turn the viewer off.']);
                }
                if ($model->status === 'published' && ! $model->main_image_id) {
                    throw ValidationException::withMessages(['main_image_id' => 'Publishing requires a main image.']);
                }
            }

            return $model->refresh();
        });
    }

    public function productRules(?Model $record = null): array
    {
        $rules = ['sku' => ['nullable', 'string', 'max:100', Rule::unique('products', 'sku')->ignore($record?->id)], 'category_id' => ['required', Rule::exists('categories', 'id')->where('active', true)], 'stone_type_id' => ['required', Rule::exists('stone_types', 'id')->where('active', true)], 'finishes' => 'required|array|min:1', 'finishes.*' => ['integer', 'distinct', Rule::exists('finishes', 'id')->where('active', true)], 'colors' => 'array', 'colors.*' => ['integer', 'distinct', Rule::exists('colors', 'id')->where('active', true)], 'applications' => 'array', 'applications.*' => 'integer|distinct|exists:applications,id', 'gallery' => 'array|max:12', 'gallery.*' => ['integer', 'distinct', Rule::exists('media', 'id')->where('asset_type', 'image')->where('processing_status', 'ready')], 'format_options' => 'required|array|min:1|max:3', 'format_options.*.format_id' => ['required', 'integer', 'distinct', Rule::exists('formats', 'id')->where('active', true)], 'format_options.*.verified' => 'required|boolean', 'format_options.*.allow_custom' => 'required|boolean', 'configuration' => 'required|array:version,geometry,width,height,thickness,dimensions_verified,finish,scale,rotation,roughness,metalness,bump_strength,preset', 'configuration.version' => 'required|integer|in:1', 'configuration.geometry' => 'required|in:slab,tile,block', 'configuration.finish' => 'required|in:honed,polished,rough', 'configuration.dimensions_verified' => 'required|boolean', 'configuration.scale' => 'required|numeric|between:0.25,4', 'configuration.rotation' => 'required|numeric|between:0,360', 'configuration.preset' => 'required|in:studio,neutral'];
        $rules['viewer_enabled'] = 'required|boolean';
        $rules['configuration'] = 'required|array:version,geometry,width,height,thickness,dimensions_verified,finish,scale,rotation,roughness,metalness,bump_strength,preset,source,shape,shape_parameters,parameter_limits,customer_dimensions,model_media_id,model_approved,top_media_id,bottom_media_id,side_media_id,edge_finish';
        $rules['configuration.source'] = 'required|in:procedural,glb';
        $rules['configuration.shape'] = ['nullable', Rule::in(array_keys(StoneGeometry::FIELDS))];
        $rules['configuration.shape_parameters'] = 'nullable|array';
        $rules['configuration.parameter_limits'] = 'nullable|array';
        $rules['configuration.customer_dimensions'] = 'required|boolean';
        $rules['configuration.model_approved'] = 'required|boolean';
        $rules['configuration.model_media_id'] = ['nullable', 'integer', Rule::exists('media', 'id')->where('asset_type', 'model')->where('processing_status', 'ready')];
        foreach (['top', 'bottom', 'side'] as $face) {
            $rules['configuration.'.$face.'_media_id'] = ['nullable', 'integer', Rule::exists('media', 'id')->where('asset_type', 'image')->where('processing_status', 'ready')];
        }
        $rules['configuration.edge_finish'] = 'required|in:same,rough';
        foreach (['width', 'height', 'thickness'] as $d) {
            $rules['configuration.'.$d] = 'required|numeric|between:0.5,500';
            $rules['format_options.*.'.$d] = 'required|numeric|between:0.5,500';
        }
        foreach (['roughness', 'metalness', 'bump_strength'] as $p) {
            $rules['configuration.'.$p] = 'required|numeric|between:0,1';
        }

        return $rules;
    }

    private function validateOptions(array $data): void
    {
        if (! ($data['viewer_enabled'] ?? false)) {
            return;
        }
        $config = $data['configuration'];
        if (! Finish::whereIn('id', $data['finishes'])->where('simulation', $config['finish'])->exists()) {
            throw ValidationException::withMessages(['configuration.finish' => 'Choose a simulation associated with a supported commercial finish.']);
        }
        if (! Format::whereIn('id', array_column($data['format_options'], 'format_id'))->where('geometry', $config['geometry'])->exists()) {
            throw ValidationException::withMessages(['configuration.geometry' => 'Default geometry must be one of the selected formats.']);
        }
    }

    private function user(array $data, ?User $record): User
    {
        $values = Validator::make($data, ['name' => 'required|string|max:150', 'email' => ['required', 'email', 'max:254', Rule::unique('users')->ignore($record?->id)], 'password' => [$record ? 'nullable' : 'required', 'string', 'min:14', 'max:128'], 'role' => 'required|in:super_admin,content_manager', 'active' => 'required|boolean'])->validate();

        return DB::transaction(function () use ($record, $values) {
            if ($record?->isSuperAdmin() && (! $values['active'] || $values['role'] !== 'super_admin')) {
                User::where('role', 'super_admin')->where('active', true)->lockForUpdate()->get();
                if (User::where('role', 'super_admin')->where('active', true)->whereKeyNot($record->id)->count() === 0) {
                    throw ValidationException::withMessages(['role' => 'Keep at least one active Super Admin.']);
                }
            }
            if (empty($values['password'])) {
                unset($values['password']);
            }
            $user = $record ?? new User;
            $user->forceFill($values)->save();

            return $user;
        });
    }

    private function media(array $data, ?Media $record): Media
    {
        $validated = Validator::make($data, ['purpose' => 'required|in:image,texture,logo,favicon', 'translations' => 'required|array:fr,en,ar', 'translations.*.name' => 'nullable|string|max:200', 'upload' => [$record ? 'nullable' : 'required', 'file']])->validate();

        return DB::transaction(function () use ($record, $validated) {
            if (! empty($validated['upload'])) {
                $replacement = app(MediaLibrary::class)->ingest($validated['upload'], $validated['purpose']);
                if ($record) {
                    // Replacement keeps the ID and all references; originals are retained privately.
                    $attributes = $replacement->only($replacement->getFillable());
                    $replacement->delete();
                    $record->fill($attributes)->save();
                } else {
                    $record = $replacement;
                }
            }
            $record->update(['purpose' => $validated['purpose']]);
            foreach ($validated['translations'] as $locale => $t) {
                $record->translations()->updateOrCreate(['locale' => $locale], ['name' => $t['name'] ?? '']);
            }

            return $record;
        });
    }
}
