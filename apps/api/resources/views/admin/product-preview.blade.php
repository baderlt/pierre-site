<div class="space-y-4">
    @if($product->mainImage)<img src="{{ $product->mainImage->url('preview') }}" alt="{{ $product->mainImage->label(app()->getLocale()) }}" style="max-height:300px;max-width:100%;object-fit:contain" />@endif
    <p><strong>{{ $product->label(app()->getLocale()) }}</strong> · {{ __(ucfirst($product->status)) }}</p>
    <p>{{ $product->label(app()->getLocale(),'description') }}</p>
    <p>{{ __('Commercial finishes') }}: {{ $product->finishes->map(fn($f)=>$f->label(app()->getLocale()))->join(', ') }}</p>
    @if($product->configuration)
    <p>{{ __('Procedural geometry') }}: {{ __(ucfirst($product->configuration->geometry)) }} · <bdi>{{ $product->configuration->width }} × {{ $product->configuration->height }} × {{ $product->configuration->thickness }} {{ __('cm') }}</bdi>. {{ $product->configuration->dimensions_verified ? __('Verified dimensions') : __('Illustrative dimensions') }}.</p>
    @endif
    <p>{{ __('Saved configuration is used by the public product viewer. Live draft 3D preview is not available.') }}</p>
</div>
