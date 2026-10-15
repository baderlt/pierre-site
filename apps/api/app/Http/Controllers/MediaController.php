<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Filament\Facades\Filament;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function show(Media $media, string $variant)
    {
        abort_unless(in_array($variant, ['swatch', 'thumb', 'card', 'large', 'preview', 'texture', 'banner', 'hero_mobile', 'banner_mobile', 'model'], true), 404);
        abort_unless(($variant === 'model') === ($media->asset_type === 'model'), 404);
        $admin = auth()->user()?->canAccessPanel(Filament::getPanel('admin')) ?? false;
        abort_unless($admin || $media->isPubliclyReferenced(), 404);
        $path = $media->derivatives[$variant]['path'] ?? (in_array($variant, ['swatch', 'card', 'large', 'hero_mobile', 'banner_mobile'], true) ? ($media->derivatives['preview']['path'] ?? null) : null);
        abort_unless($path && Storage::disk($media->disk)->exists($path), 404);

        return Storage::disk($media->disk)->response($path, null, ['Content-Type' => $variant === 'model' ? 'model/gltf-binary' : 'image/webp', 'X-Content-Type-Options' => 'nosniff', 'Cache-Control' => $admin || $variant === 'model' ? 'private, no-store' : 'public, max-age=0, must-revalidate'], 'inline');
    }
}
