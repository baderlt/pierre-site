<?php

namespace App\Console\Commands;

use App\Domain\MediaLibrary;
use App\Models\Media;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PruneMedia extends Command
{
    protected $signature = 'time-stone:prune-media {--apply : Delete abandoned media and expired temporary uploads}';

    protected $description = 'Dry-run or prune unreferenced media older than seven days; temporary uploads expire after 24 hours.';

    public function handle(MediaLibrary $library): int
    {
        $count = 0;
        Media::where('created_at', '<', now()->subDays(7))->chunkById(100, function ($items) use ($library, &$count) {
            foreach ($items as $media) {
                if (! $library->referenced($media)) {
                    $count++;
                    if ($this->option('apply')) {
                        DB::transaction(function () use ($media, $library) {
                            Media::whereKey($media->id)->lockForUpdate()->firstOrFail();
                            if ($library->referenced($media)) {
                                return;
                            }
                            $paths = [$media->path, ...array_column($media->derivatives, 'path')];
                            $media->delete();
                            DB::afterCommit(fn () => Storage::disk('local')->delete($paths));
                        });
                    }
                }
            }
        });
        $disk = Storage::disk('local');
        foreach ($disk->allFiles('livewire-tmp') as $path) {
            if ($disk->lastModified($path) < now()->subDay()->timestamp && $this->option('apply')) {
                $disk->delete($path);
            }
        }
        $this->info(($this->option('apply') ? 'Pruned: ' : 'Eligible (dry run): ').$count.' media records.');

        return self::SUCCESS;
    }
}
