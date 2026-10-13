<form method="POST" action="{{ route('admin.locale') }}" class="admin-language-switcher" aria-label="{{ __('Administration language') }}">
    @csrf
    <input type="hidden" name="return_to" value="{{ request()->getRequestUri() }}">
    <label for="admin-locale">{{ __('Language') }}</label>
    <select id="admin-locale" name="locale" dir="ltr">
        @foreach(['fr' => 'Français', 'en' => 'English', 'ar' => 'العربية'] as $locale => $label)
            <option value="{{ $locale }}" @selected(app()->getLocale() === $locale) lang="{{ $locale }}">{{ $label }}</option>
        @endforeach
    </select>
    <button type="submit">{{ __('Apply') }}</button>
</form>
