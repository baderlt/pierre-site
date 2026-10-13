<x-filament-widgets::widget>
    <x-filament::section :heading="__('TIME STONE · Editorial workspace')" :description="__('Database activity only. Illustrative catalogue data must be verified before production publication.')">
        <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:24px">
            <x-filament::button tag="a" href="{{ url('/admin/page-sections').'?filters[banners][isActive]=1' }}" color="gray">{{ __('Manage banners') }}</x-filament::button>
            @foreach(['Add product'=>'products/create','Manage categories'=>'categories','Manage applications'=>'applications','Manage quotations'=>'quotation-requests'] as $label=>$path)
                <x-filament::button tag="a" href="{{ url('/admin/'.$path) }}" color="gray">{{ __($label) }}</x-filament::button>
            @endforeach
            @if($homepage)<x-filament::button tag="a" href="{{ url('/admin/pages/'.$homepage.'/edit') }}" color="gray">{{ __('Edit homepage') }}</x-filament::button>@endif
            <x-filament::button tag="a" href="{{ url('/admin/page-sections') }}" color="gray">{{ __('Edit page sections') }}</x-filament::button>
            @can('viewAny', \App\Models\SiteSetting::class)<x-filament::button tag="a" href="{{ url('/admin/site-settings') }}" color="gray">{{ __('Website settings') }}</x-filament::button>@endcan
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:28px">
            <div><h3 style="font-weight:600;margin-bottom:12px">{{ __('Recent content changes') }}</h3>
                @forelse($changes as $change)<p style="margin:10px 0"><a class="text-primary-600" href="{{ $change['url'] }}">{{ $change['label'] }}</a><br><small>{{ $change['updated_at']->translatedFormat('d M Y H:i') }}</small></p>@empty<p>{{ __('No content changes yet.') }}</p>@endforelse
            </div>
            <div><h3 style="font-weight:600;margin-bottom:12px">{{ __('Recent quotations') }}</h3>
                @forelse($quotes as $quote)<p style="margin:10px 0"><a class="text-primary-600" href="{{ url('/admin/quotation-requests/'.$quote->id.'/edit') }}">{{ $quote->reference }}</a> · {{ __(ucfirst(str_replace('_', ' ', $quote->status))) }}</p>@empty<p>{{ __('No quotation requests yet.') }}</p>@endforelse
            </div>
        </div>
    </x-filament::section>
</x-filament-widgets::widget>
