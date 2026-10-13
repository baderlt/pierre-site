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
                $rules[$field] = ['nullable', 'integer', Rule::exists('media', 'id')->where('processing_status', 'ready')];
            }
        }
        if ($class === Product::class) {
            $rules += $this->productRules($record);
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
            $rules += ['classification' => 'nullable|string|max:80', 'internal_notes' => 'nullable|string|max:10000', 'finishes' => 'array', 'finishes.*' => 'integer|distinct|exists:finishes,id', 'colors' => 'array', 'colors.*' => 'integer|distinct|exists:colors,id', 'media' => 'array', 'media.*' => 'integer|distinct|exists:media,id'];
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
            $rules += ['products' => 'array', 'products.*' => 'integer|distinct|exists:products,id', 'gallery' => 'array', 'gallery.*' => 'integer|distinct|exists:media,id'];
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
                $model->configuration()->updateOrCreate([], $validated['configuration']);
                $formats = [];
                foreach ($validated['format_options'] as $format) {
                    $id = $format['format_id'];
                    unset($format['format_id']);
                    $formats[$id] = $format;
                }
                $model->formats()->sync($formats);
                if ($model->status === 'published' && (! $model->main_image_id || ! $model->texture_id)) {
                    throw ValidationException::withMessages(['main_image_id' => 'Publishing requires a main image and texture.']);
                }
            }

            return $model->refresh();
        });
    }

    public function productRules(?Model $record = null): array
    {
        $rules = ['sku' => ['nullable', 'string', 'max:100', Rule::unique('products', 'sku')->ignore($record?->id)], 'category_id' => ['required', Rule::exists('categories', 'id')->where('active', true)], 'stone_type_id' => ['required', Rule::exists('stone_types', 'id')->where('active', true)], 'finishes' => 'required|array|min:1', 'finishes.*' => ['integer', 'distinct', Rule::exists('finishes', 'id')->where('active', true)], 'colors' => 'array', 'colors.*' => ['integer', 'distinct', Rule::exists('colors', 'id')->where('active', true)], 'applications' => 'array', 'applications.*' => 'integer|distinct|exists:applications,id', 'gallery' => 'array|max:12', 'gallery.*' => 'integer|distinct|exists:media,id', 'format_options' => 'required|array|min:1|max:3', 'format_options.*.format_id' => ['required', 'integer', 'distinct', Rule::exists('formats', 'id')->where('active', true)], 'format_options.*.verified' => 'required|boolean', 'format_options.*.allow_custom' => 'required|boolean', 'configuration' => 'required|array:version,geometry,width,height,thickness,dimensions_verified,finish,scale,rotation,roughness,metalness,bump_strength,preset', 'configuration.version' => 'required|integer|in:1', 'configuration.geometry' => 'required|in:slab,tile,block', 'configuration.finish' => 'required|in:honed,polished,rough', 'configuration.dimensions_verified' => 'required|boolean', 'configuration.scale' => 'required|numeric|between:0.25,4', 'configuration.rotation' => 'required|numeric|between:0,360', 'configuration.preset' => 'required|in:studio,neutral'];
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
