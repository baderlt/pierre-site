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

    public function isPublic(Media $media): bool
    {
        if (! SiteSetting::where('public_enabled', true)->exists() || $media->processing_status !== 'ready') {
            return false;
        }
        $id = $media->id;

        return Product::publicCatalogue()->where(fn ($q) => $q->where('main_image_id', $id)->orWhere('texture_id', $id)->orWhere('og_image_id', $id)->orWhereHas('gallery', fn ($q) => $q->where('media.id', $id)))->exists()
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
