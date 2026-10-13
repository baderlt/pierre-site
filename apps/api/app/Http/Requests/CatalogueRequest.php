<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CatalogueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = ['locale' => 'sometimes|in:fr,en,ar', 'q' => 'sometimes|nullable|string|max:100', 'sort' => 'sometimes|in:featured,newest,name_asc,name_desc', 'page' => 'sometimes|integer|min:1|max:100000', 'per_page' => 'sometimes|integer|min:1|max:48'];
        foreach (['category', 'stone_type', 'finish', 'color', 'application'] as $key) {
            $rules[$key] = 'sometimes|nullable|string|max:100|regex:/^[a-z0-9-]+$/';
        }

        return $rules;
    }
}
