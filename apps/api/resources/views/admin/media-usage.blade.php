<div class="space-y-4">
    <img src="{{ $media->url('preview') }}" alt="{{ $media->label(app()->getLocale()) ?: $media->original_filename }}" style="width:100%;max-height:260px;object-fit:contain" />
    <p>{{ __('Replacing this media file updates every assignment below. To change one placement only, edit that placement and select or upload another image.') }}</p>
    <ul class="space-y-4">
        @forelse($locations as $location)
            <li><strong>{{ $location['name'] }}</strong><p>{{ $location['roles'] }}</p>@if($location['edit'])<x-filament::link :href="$location['edit']">{{ __('Edit image placement') }}</x-filament::link>@endif</li>
        @empty<li>{{ __('No current content assignment. Archived quotations may still protect this media from deletion.') }}</li>@endforelse
    </ul>
</div>
