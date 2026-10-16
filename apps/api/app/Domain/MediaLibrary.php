<?php

namespace App\Domain;

use App\Models\Application;
use App\Models\Media;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\Product;
use App\Models\SiteSetting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class MediaLibrary
{
    public function ingestModel(UploadedFile $file): Media
    {
        if (function_exists('posix_geteuid') && posix_geteuid() === 0) throw ValidationException::withMessages(['model_upload' => 'Model validation requires a non-root application worker.']);
        Validator::make(['model_upload' => $file], ['model_upload' => 'required|file|max:8192'])->validate();
        if (strtolower($file->getClientOriginalExtension()) !== 'glb') throw ValidationException::withMessages(['model_upload' => 'Upload a GLB 2 file.']);
        $limit = ini_parse_quantity(ini_get('memory_limit'));
        if ($limit > 0 && memory_get_usage() + $file->getSize() * 8 + 16777216 > $limit) throw ValidationException::withMessages(['model_upload' => 'Model exceeds the server validation memory budget.']);
        $validated = app(GlbValidator::class)->validate(file_get_contents($file->getRealPath()));
        $base = 'models/'.Str::uuid();$paths = [$base.'/original.glb', $base.'/model.glb'];
        try {
            if (! Storage::disk('local')->putFileAs($base, $file, 'original.glb') || ! Storage::disk('local')->put($paths[1], $validated['bytes'])) throw new \RuntimeException('Private model storage failed.');
            $media = Media::create(['original_filename' => Str::limit(basename(str_replace('\\', '/', $file->getClientOriginalName())), 200, ''), 'disk' => 'local', 'path' => $paths[0], 'mime' => 'model/gltf-binary', 'bytes' => $file->getSize(), 'width' => 0, 'height' => 0, 'purpose' => 'image', 'asset_type' => 'model', 'processing_status' => 'ready', 'derivatives' => ['model' => ['path' => $paths[1], 'bytes' => strlen($validated['bytes']), ...$validated['metadata']]], 'uploaded_at' => now()]);
            if (DB::transactionLevel() > 0) DB::afterRollBack(fn () => Storage::disk('local')->delete($paths));
            return $media;
        } catch (\Throwable $e) { Storage::disk('local')->delete($paths);throw $e; }
    }

    public function ingest(UploadedFile $file, string $purpose = 'image'): Media
    {
        Validator::make(['file' => $file, 'purpose' => $purpose], ['file' => 'required|file|max:10240|mimetypes:image/jpeg,image/png,image/webp', 'purpose' => 'required|in:image,texture,logo,favicon'])->validate();
        $info = @getimagesize($file->getRealPath());
        if (! $info || $info[0] < 1 || $info[1] < 1 || $info[0] > 8192 || $info[1] > 8192 || $info[0] * $info[1] > 20000000) {
            throw ValidationException::withMessages(['upload' => 'Image must decode and contain at most 20 megapixels (8192 px per side). GLB and SVG are disabled.']);
        }
        $limit = ini_parse_quantity(ini_get('memory_limit'));
        $previewRatio = min(1, 2560 / max($info[0], $info[1]));
        $previewPixels = (int) ceil($info[0] * $previewRatio) * (int) ceil($info[1] * $previewRatio);
        if ($limit > 0 && memory_get_usage() + ($info[0] * $info[1] + $previewPixels) * 5 + 8 * 1024 * 1024 > $limit) {
            throw ValidationException::withMessages(['upload' => 'This image exceeds the server decoding memory budget. Use a smaller image.']);
        }
        $source = match ($info['mime']) {
            'image/jpeg' => @imagecreatefromjpeg($file->getRealPath()),'image/png' => @imagecreatefrompng($file->getRealPath()),'image/webp' => @imagecreatefromwebp($file->getRealPath()),default => false
        };
        if (! $source) {
            throw ValidationException::withMessages(['upload' => 'The image could not be decoded.']);
        }
        $base = 'media/'.Str::uuid();
        $paths = [];
        try {
            $extension = match ($info['mime']) {
                'image/jpeg' => 'jpg','image/png' => 'png',default => 'webp'
            };
            $original = $base.'/original.'.$extension;
            Storage::disk('local')->putFileAs($base, $file, 'original.'.$extension);
            $paths[] = $original;
            $derivatives = [];
            foreach (['swatch' => 192, 'thumb' => 320, 'card' => 640, 'large' => 960, 'preview' => 1200, 'texture' => 2048, 'banner' => 2560] as $variant => $limit) {
                $ratio = min(1, $limit / max($info[0], $info[1]));
                $w = max(1, (int) round($info[0] * $ratio));
                $h = max(1, (int) round($info[1] * $ratio));
                $target = imagecreatetruecolor($w, $h);
                imagealphablending($target, false);
                imagesavealpha($target, true);
                imagecopyresampled($target, $source, 0, 0, 0, 0, $w, $h, $info[0], $info[1]);
                ob_start();
                $encoded = imagewebp($target, null, 90);
                $bytes = ob_get_clean();
                imagedestroy($target);
                if (! $encoded || $bytes === '') {
                    throw ValidationException::withMessages(['upload' => 'The image derivative could not be encoded.']);
                }
                $path = $base.'/'.$variant.'.webp';
                Storage::disk('local')->put($path, $bytes);
                $paths[] = $path;
                $derivatives[$variant] = ['path' => $path, 'width' => $w, 'height' => $h, 'bytes' => strlen($bytes)];
            }
            $mobile = $this->mobileBannerDerivatives($source, $base);
            $paths = [...$paths, ...array_column($mobile, 'path')];
            $derivatives += $mobile;
            $media = Media::create(['original_filename' => Str::limit(basename(str_replace('\\', '/', $file->getClientOriginalName())), 200, ''), 'disk' => 'local', 'path' => $original, 'mime' => $info['mime'], 'bytes' => $file->getSize(), 'width' => $info[0], 'height' => $info[1], 'purpose' => $purpose, 'processing_status' => 'ready', 'derivatives' => $derivatives, 'uploaded_at' => now()]);
            if (DB::transactionLevel() > 0) {
                DB::afterRollBack(fn () => Storage::disk('local')->delete($paths));
            }

            return $media;
        } catch (\Throwable $e) {
            foreach ($paths as $path) {
                Storage::disk('local')->delete($path);
            } throw $e;
        } finally {
            imagedestroy($source);
        }
    }

    /** Art direction matches the existing narrow-screen object-fit positions; never upscale. */
    public function mobileBannerDerivatives(\GdImage $source, string $base, string $disk = 'local'): array
    {
        $result = [];
        try {
            foreach (['hero_mobile' => [460 / 635, 1280, .44], 'banner_mobile' => [479 / 330, 696, .5]] as $variant => [$aspect, $height, $position]) {
                $cropW = min(imagesx($source), (int) round(imagesy($source) * $aspect));
                $cropH = imagesy($source);
                $ratio = min(1, $height / $cropH);
                $w = max(1, (int) round($cropW * $ratio));
                $h = max(1, (int) round($cropH * $ratio));
                $target = imagecreatetruecolor($w, $h);
                imagealphablending($target, false);
                imagesavealpha($target, true);
                imagecopyresampled($target, $source, 0, 0, (int) round((imagesx($source) - $cropW) * $position), (int) round((imagesy($source) - $cropH) * .5), $w, $h, $cropW, $cropH);
                ob_start();
                $encoded = imagewebp($target, null, 90);
                $bytes = ob_get_clean();
                imagedestroy($target);
                if (! $encoded || $bytes === '') {
                    throw ValidationException::withMessages(['upload' => 'The mobile banner could not be encoded.']);
                }
                $path = $base.'/'.$variant.'.webp';
                Storage::disk($disk)->put($path, $bytes);
                $result[$variant] = ['path' => $path, 'width' => $w, 'height' => $h, 'bytes' => strlen($bytes)];
            }

            return $result;
        } catch (\Throwable $e) {
            Storage::disk($disk)->delete(array_column($result, 'path'));
            throw $e;
        }
    }

    /** Admin-only assignment map. Query each owner type once, never once per image row. */
    public function locations(Media $media): array
    {
        Gate::authorize('view', $media);
        $locations = [];
        $owners = [
            Product::class => ['main_image_id' => 'Main image', 'texture_id' => 'Texture', 'og_image_id' => 'Open Graph image'],
            \App\Models\Category::class => ['image_id' => 'Image'],
            \App\Models\StoneType::class => ['image_id' => 'Image'],
            \App\Models\Finish::class => ['image_id' => 'Image'],
            \App\Models\Color::class => ['image_id' => 'Image'],
            \App\Models\Format::class => ['image_id' => 'Image'],
            Application::class => ['image_id' => 'Image'],
            Page::class => ['og_image_id' => 'Open Graph image'],
            PageSection::class => ['image_id' => 'Image'],
            SiteSetting::class => ['logo_id' => 'Logo', 'favicon_id' => 'Favicon'],
        ];
        $galleries = [Product::class => 'gallery', Application::class => 'gallery', \App\Models\StoneType::class => 'media'];
        foreach ($owners as $class => $fields) {
            if (! Gate::allows('viewAny', $class)) continue;
            $gallery = $galleries[$class] ?? null;
            $query = $class::query()->where(function ($query) use ($fields, $media, $gallery) {
                foreach ($fields as $field => $label) $query->orWhere($field, $media->id);
                if ($gallery) $query->orWhereHas($gallery, fn ($q) => $q->where('media.id', $media->id));
                if ($query->getModel() instanceof Product) $query->orWhereHas('configuration', fn ($q) => $q->where(fn ($q) => $q->where('model_media_id', $media->id)->orWhere('top_media_id', $media->id)->orWhere('bottom_media_id', $media->id)->orWhere('side_media_id', $media->id)));
            });
            if ($class !== SiteSetting::class) $query->with('translations');
            if ($class === PageSection::class) $query->with('page.translations');
            if ($class === Product::class) $query->with('configuration');
            if ($gallery) $query->withExists([$gallery.' as usage_gallery' => fn ($q) => $q->where('media.id', $media->id)]);
            foreach ($query->get() as $record) {
                $roles = [];
                foreach ($fields as $field => $label) if ((string) $record->$field === (string) $media->id) $roles[] = __($label);
                if ($record->usage_gallery ?? false) $roles[] = __($gallery === 'media' ? 'Material textures' : 'Gallery images');
                if ($record instanceof Product && $record->configuration) {
                    foreach (['model_media_id' => 'Saved validated GLB', 'top_media_id' => 'Top Material', 'bottom_media_id' => 'Bottom Material', 'side_media_id' => 'Side Material'] as $field => $label) {
                        if ((string) $record->configuration->$field === (string) $media->id) $roles[] = __($label);
                    }
                }
                $resource = 'App\\Filament\\Resources\\'.class_basename($class).'Resource';
                $name = $record instanceof SiteSetting ? $record->brand_name : ($record->label(app()->getLocale()) ?: ($record->slug ?? $record->key));
                if ($record instanceof PageSection) $name = ($record->page?->label(app()->getLocale()) ?: $record->page?->slug).' / '.$record->key.' · '.$name;
                $locations[] = ['name' => $resource::getModelLabel().' · '.$name, 'roles' => implode(' · ', $roles), 'edit' => Gate::allows('update', $record) ? $resource::getUrl('edit', ['record' => $record]) : null];
            }
        }
        return $locations;
    }

    public function isPublic(Media $media): bool
    {
        if (! SiteSetting::where('public_enabled', true)->exists() || $media->processing_status !== 'ready') {
            return false;
        }
        $id = $media->id;

        if ($media->asset_type === 'model') {
            $p = Product::publicCatalogue()->where('viewer_enabled', true)->whereHas('configuration', fn ($q) => $q->where('source', 'glb')->where('model_approved', true)->where('customer_dimensions', false)->where('model_media_id', $id)
                ->whereExists(fn ($f) => $f->selectRaw('1')->from('product_finish')->join('finishes', 'finishes.id', '=', 'product_finish.finish_id')->whereColumn('product_finish.product_id', 'product_3d_configs.product_id')->where('finishes.active', true)->whereColumn('finishes.simulation', 'product_3d_configs.finish'))
                ->whereExists(fn ($f) => $f->selectRaw('1')->from('product_formats')->join('formats', 'formats.id', '=', 'product_formats.format_id')->whereColumn('product_formats.product_id', 'product_3d_configs.product_id')->where('formats.active', true)->whereColumn('formats.geometry', 'product_3d_configs.geometry')))->with(['configuration.modelMedia', 'finishes', 'formats'])->first();
            return $p && app(ViewerConfiguration::class)->public($p) !== null;
        }

        return Product::publicCatalogue()->where(fn ($q) => $q->where('main_image_id', $id)->orWhere('texture_id', $id)->orWhere('og_image_id', $id)->orWhereHas('gallery', fn ($q) => $q->where('media.id', $id)))->exists()
            || Product::publicCatalogue()->where('viewer_enabled', true)->whereHas('configuration', fn ($q) => $q->where('source', 'procedural')->where(fn ($q) => $q->where('top_media_id', $id)->orWhere('bottom_media_id', $id)->orWhere('side_media_id', $id)))->exists()
            || Application::published()->where(fn ($q) => $q->where('image_id', $id)->orWhereHas('gallery', fn ($q) => $q->where('media.id', $id)))->exists()
            || Page::published()->where('og_image_id', $id)->exists()
            || PageSection::where('visible', true)->where('image_id', $id)->whereHas('page', fn ($q) => $q->published())->exists()
            || SiteSetting::where('public_enabled', true)->where(fn ($q) => $q->where('logo_id', $id)->orWhere('favicon_id', $id))->exists()
            || DB::table('categories')->where('active', true)->where('image_id', $id)->exists()
            || DB::table('stone_types')->where('active', true)->where('image_id', $id)->exists()
            || DB::table('stone_type_media')->join('stone_types', 'stone_types.id', '=', 'stone_type_media.stone_type_id')->where('stone_types.active', true)->where('media_id', $id)->exists();
    }

    public function referenced(Media $media): bool
    {
        if(DB::table('quotation_items')->where(function($q)use($media){$q->where('configuration_snapshot->texture_media_id',(string)$media->id)->orWhere('configuration_snapshot->geometry_selection->model_media_id',(string)$media->id);foreach(['top','bottom','side']as$face)$q->orWhere('configuration_snapshot->geometry_selection->material_media_ids->'.$face.'_media_id',(string)$media->id);})->exists())return true;
        if (DB::table('product_3d_configs')->where(fn ($q) => $q->where('model_media_id', $media->id)->orWhere('top_media_id', $media->id)->orWhere('bottom_media_id', $media->id)->orWhere('side_media_id', $media->id))->exists()) return true;
        foreach (['products' => ['main_image_id', 'texture_id', 'og_image_id'], 'categories' => ['image_id'], 'stone_types' => ['image_id'], 'finishes' => ['image_id'], 'formats' => ['image_id'], 'colors' => ['image_id'], 'applications' => ['image_id'], 'pages' => ['og_image_id'], 'page_sections' => ['image_id'], 'site_settings' => ['logo_id', 'favicon_id'], 'product_media' => ['media_id'], 'application_media' => ['media_id'], 'stone_type_media' => ['media_id']] as $table => $columns) {
            if (DB::table($table)->where(function ($q) use ($columns, $media) {
                foreach ($columns as $column) {
                    $q->orWhere($column, $media->id);
                }
            })->exists()) {
                return true;
            }
        }

        return false;
    }

    public function remove(Media $media): void
    {
        Gate::authorize('delete', $media);
        DB::transaction(function () use ($media) {
            Media::whereKey($media->id)->lockForUpdate()->firstOrFail();
            if ($this->referenced($media)) {
                throw ValidationException::withMessages(['media' => 'This image is still referenced. Reassign it before removal.']);
            }
            $paths = [$media->path, ...array_column($media->derivatives, 'path')];
            $disk = $media->disk;
            $media->delete();
            DB::afterCommit(fn () => Storage::disk($disk)->delete($paths));
        });
    }
}
