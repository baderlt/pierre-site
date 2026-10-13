<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QuotationSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $data = $this->all();
        array_walk_recursive($data, function (&$v) {
            if (is_string($v)) {
                $v = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '');
            }
        });
        if (isset($data['customer']['email'])) {
            $data['customer']['email'] = mb_strtolower($data['customer']['email']);
        }
        $this->replace($data);
    }

    public function rules(): array
    {
        return [
            'locale' => 'required|in:fr,en,ar', 'customer' => 'required|array:name,email,phone', 'customer.name' => 'required|string|max:150',
            'customer.email' => 'required|email:rfc|max:254', 'customer.phone' => ['nullable', 'string', 'max:40', 'regex:/^[+()0-9 .-]{6,40}$/'],
            'delivery' => 'required|array:country_code,location', 'delivery.country_code' => ['required', 'string', function ($a, $v, $fail) {
                if (! in_array($v, config('integration.country_codes'), true)) {
                    $fail('Invalid country code.');
                }
            }],
            'delivery.location' => 'required|string|max:200', 'project_details' => 'required|string|max:3000',
            'privacy_acknowledged' => 'required|accepted', 'website' => 'present|nullable|string|max:0', 'challenge' => 'required|string|max:1000',
            'items' => 'present|array|max:20', 'items.*' => 'array:product_id,format_id,finish_id,dimensions_cm,quantity,unit,custom_dimensions_requested,configuration',
            'items.*.product_id' => 'required|integer|min:1', 'items.*.format_id' => 'required|integer|min:1', 'items.*.finish_id' => 'required|integer|min:1',
            'items.*.dimensions_cm' => 'required|array:width,height,thickness', 'items.*.dimensions_cm.*' => 'required|numeric|between:0.5,500|decimal:0,2',
            'items.*.dimensions_cm.width' => 'required', 'items.*.dimensions_cm.height' => 'required', 'items.*.dimensions_cm.thickness' => 'required',
            'items.*.quantity' => 'required|numeric|gt:0|lte:1000000|decimal:0,3', 'items.*.unit' => 'required|in:piece,m2,m3',
            'items.*.custom_dimensions_requested' => 'required|boolean', 'items.*.configuration' => 'sometimes|array:version,shape,finish,width,height,thickness,scale,rotation',
            'items.*.configuration.version' => 'required_with:items.*.configuration|in:1', 'items.*.configuration.shape' => 'required_with:items.*.configuration|in:slab,block,tile',
            'items.*.configuration.finish' => 'required_with:items.*.configuration|in:honed,polished,rough',
            'items.*.configuration.width' => 'required_with:items.*.configuration|numeric|between:0.5,500', 'items.*.configuration.height' => 'required_with:items.*.configuration|numeric|between:0.5,500', 'items.*.configuration.thickness' => 'required_with:items.*.configuration|numeric|between:0.5,500',
            'items.*.configuration.scale' => 'required_with:items.*.configuration|numeric|between:0.25,4', 'items.*.configuration.rotation' => 'required_with:items.*.configuration|numeric|between:0,360',
        ];
    }
}
