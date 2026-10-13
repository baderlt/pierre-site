<?php

use App\Http\Controllers\MediaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;

Route::redirect('/', '/admin');
Route::post('/admin/locale', function (Request $request) {
    $data = $request->validate([
        'locale' => ['required', Rule::in(['fr', 'en', 'ar'])],
        'return_to' => ['required', 'string', 'max:2048', 'regex:~\A/admin(?:/[a-zA-Z0-9._%/-]*)?(?:\?[^\r\n]*)?\z~D'],
    ]);
    $request->session()->put('admin_locale', $data['locale']);

    return redirect()->to($data['return_to']);
})->name('admin.locale');
Route::get('/media/{media}/{variant}', [MediaController::class, 'show'])->whereNumber('media')->name('media.show');
