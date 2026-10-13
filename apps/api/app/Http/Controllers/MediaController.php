<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Filament\Facades\Filament;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function show(Media $media, string $variant)
    {
        abort_unless(in_array($variant, ['swatch', 'thumb', 'card', 'large', 'preview', 'texture', 'banner'], true), 404);
        $admin = auth()->user()?->canAccessPanel(Filament::getPanel('admin')) ?? false;
        abort_unless($admin || $media->isPubliclyReferenced(), 404);
        $path = $media->derivatives[$variant]['path'] ?? (in_array($variant, ['swatch', 'card', 'large'], true) ? ($media->derivatives['preview']['path'] ?? null) : null);
        abort_unless($path && Storage::disk($media->disk)->exists($path), 404);

        return Storage::disk($media->disk)->response($path, null, ['Content-Type' => 'image/webp', 'X-Content-Type-Options' => 'nosniff', 'Cache-Control' => $admin ? 'private, no-store' : 'public, max-age=0, must-revalidate'], 'inline');
    }
}
