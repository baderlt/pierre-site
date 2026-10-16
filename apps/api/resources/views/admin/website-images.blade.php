<x-filament-widgets::widget>
    <x-filament::section>
        <x-slot name="heading">{{ __('Website image map') }}</x-slot>
        <x-slot name="description">{{ __('Choose a page, then select an image placement to edit it. This is an image map, not a live rendering. Homepage lists show the first six items; use Products or Categories to browse all.') }}</x-slot>
        <style>
            .ts-image-map-controls{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-block-end:20px}.ts-image-map-controls select{border:1px solid #a58b63;border-radius:8px;padding:10px 14px;background:transparent;color:inherit;max-width:100%;min-width:200px}.ts-image-map-title{font-weight:600;margin-block:20px 12px}.ts-image-map-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:14px}.ts-image-map-card{border:1px solid #a58b6360;border-radius:10px;overflow:hidden;display:block;min-width:0;color:inherit;text-decoration:none}.ts-image-map-card:hover{border-color:#a58b63}.ts-image-map-card:focus-visible,.ts-image-map-controls select:focus-visible{outline:3px solid #b99759;outline-offset:3px}.ts-image-map-picture{height:130px;background:#aca08a18;display:flex;align-items:center;justify-content:center}.ts-image-map-picture img{width:100%;height:100%;object-fit:cover;object-position:center}.ts-image-map-caption{padding:12px;display:grid;gap:5px;overflow-wrap:anywhere}.ts-image-map-caption small{opacity:.75}.ts-image-map-empty{opacity:.7;padding:12px}.ts-image-map-edit{color:#a58b63;font-weight:600;font-size:13px}.ts-image-map-pagination{margin-block-start:20px}
        </style>
        <div class="ts-image-map-controls">
            <label for="ts-image-map-page">{{ __('Page / location') }}</label>
            <select id="ts-image-map-page" wire:model.live="placement">
                @foreach($options as $value => $label)<option value="{{ $value }}">{{ $label }}</option>@endforeach
            </select>
            @if($publicUrl)<x-filament::link :href="$publicUrl" target="_blank" rel="noopener noreferrer">{{ __('Open public page') }}</x-filament::link>@endif
            <span wire:loading role="status">{{ __('Loading image placements…') }}</span>
        </div>
        @foreach($groups as $title => $cards)
            <h3 class="ts-image-map-title">{{ $title }}</h3>
            <div class="ts-image-map-grid">
                @forelse($cards as $card)
                    <div class="ts-image-map-card">
                        @if($card['edit'])<a href="{{ $card['edit'] }}" style="display:block;color:inherit;text-decoration:none" aria-label="{{ __('Edit image placement') }}: {{ $card['title'] }} · {{ $card['role'] }}">@endif
                        <div class="ts-image-map-picture">
                            @if($card['image'])<img src="{{ $card['image'] }}" alt="" loading="lazy" decoding="async" />@else<span class="ts-image-map-empty">{{ __('No image selected') }}</span>@endif
                        </div>
                        <div class="ts-image-map-caption">
                            <small>{{ $card['role'] }} @if($card['state'])· {{ $card['state'] }}@endif</small>
                            <strong>{{ $card['title'] }}</strong>
                            @if($card['filename'])<small>{{ $card['filename'] }}</small>@endif
                            @if($card['edit'])<span class="ts-image-map-edit">{{ __('Edit image placement') }} →</span>@endif
                        </div>
                        @if($card['edit'])</a>@endif
                    </div>
                @empty<p class="ts-image-map-empty">{{ __('No image placements configured here yet.') }}</p>@endforelse
            </div>
        @endforeach
        @if($pagination)<div class="ts-image-map-pagination">{{ $pagination->links() }}</div>@endif
    </x-filament::section>
</x-filament-widgets::widget>
