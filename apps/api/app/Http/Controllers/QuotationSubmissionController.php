<?php

namespace App\Http\Controllers;

use App\Http\Requests\QuotationSubmissionRequest;
use App\Models\Product;
use App\Models\QuotationRequest;
use App\Models\SiteSetting;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class QuotationSubmissionController extends Controller
{
    public function challenge()
    {
        abort_unless(SiteSetting::where('public_enabled', true)->exists(), 404);

        return response()->json(['challenge' => Crypt::encryptString(json_encode(['issued' => time(), 'nonce' => Str::random(24)]))])->header('Cache-Control', 'private, no-store');
    }

    public function store(QuotationSubmissionRequest $r)
    {
        abort_unless(SiteSetting::where('public_enabled', true)->exists(), 404);
        $data = $r->validated();
        try {
            $challenge = json_decode(Crypt::decryptString($data['challenge']), true, 512, JSON_THROW_ON_ERROR);
        } catch (\Throwable) {
            throw ValidationException::withMessages(['challenge' => 'Refresh the form and retry.']);
        }
        if (! isset($challenge['issued']) || time() - $challenge['issued'] < 2 || time() - $challenge['issued'] > 7200) {
            throw ValidationException::withMessages(['challenge' => 'Refresh the form and retry.']);
        }
        $key = $r->header('Idempotency-Key', '');
        if (! Str::isUuid($key)) {
            throw ValidationException::withMessages(['idempotency_key' => 'A valid request identifier is required.']);
        }
        unset($data['challenge'],$data['website']);
        $hash = hash_hmac('sha256', json_encode($data, JSON_PRESERVE_ZERO_FRACTION), config('app.key'));
        $keyHash = hash('sha256', $key);
        $respond = function ($quote, bool $duplicate = false) use ($hash) {
            abort_unless(hash_equals($quote->payload_hash, $hash), 409, 'Request identifier already used for different information.');

            return response()->json(['reference' => $quote->reference, 'duplicate' => $duplicate], $duplicate ? 200 : 201)->header('Cache-Control', 'private, no-store');
        };
        if ($existing = QuotationRequest::where('idempotency_key', $keyHash)->first()) {
            return $respond($existing, true);
        }
        try {
            $quote = DB::transaction(function () use ($data, $keyHash, $hash) {
                $snapshots = [];
                $products = Product::publicCatalogue()->whereIn('id', array_unique(array_column($data['items'], 'product_id')))->orderBy('id')->lockForUpdate()->with(['translations', 'finishes.translations', 'formats.translations', 'texture', 'configuration.modelMedia', 'configuration.topMedia', 'configuration.bottomMedia', 'configuration.sideMedia'])->get()->keyBy('id');
                foreach ($data['items'] as $i => $item) {
                    $p = $products->get($item['product_id']);
                    if (! $p) {
                        throw ValidationException::withMessages(["items.$i.product_id" => 'This product is unavailable.']);
                    }

                    $finish = $p->finishes->first(fn ($f) => $f->active && (string) $f->id === (string) $item['finish_id']);
                    $format = $p->formats->first(fn ($f) => $f->active && (string) $f->id === (string) $item['format_id']);
                    if (! $finish || ! $format) {
                        throw ValidationException::withMessages(["items.$i" => 'Unsupported finish or format.']);
                    }
                    $geometry = null;
                    if (isset($item['geometry'])) {
                        try {$geometry = app(\App\Domain\ViewerConfiguration::class)->selection($p, $item['geometry']);}
                        catch (ValidationException $e) {throw ValidationException::withMessages(["items.$i.geometry" => collect($e->errors())->flatten()->all()]);}
                        foreach (['width', 'height', 'thickness'] as $d) if (abs($geometry['dimensions_cm'][$d] - (float) $item['dimensions_cm'][$d]) > .00001) throw ValidationException::withMessages(["items.$i.geometry" => 'Geometry bounds do not match your dimensions.']);
                    }
                    $custom = false;
                    foreach (['width', 'height', 'thickness'] as $d) {
                        if ((float) $item['dimensions_cm'][$d] !== (float) $format->pivot->$d) {
                            $custom = true;
                        }
                    }
                    $changedGeometry = $geometry && array_filter(['width', 'height', 'thickness'], fn ($d) => abs((float) $p->configuration->$d - (float) $item['dimensions_cm'][$d]) > .00001);
                    if (($geometry ? $changedGeometry : $custom) && (! $format->pivot->allow_custom || ! $item['custom_dimensions_requested'])) {
                        throw ValidationException::withMessages(["items.$i.dimensions_cm" => 'Custom dimensions require manufacturing confirmation and permission.']);
                    }
                    if ($item['unit'] === 'piece' && floor((float) $item['quantity']) !== (float) $item['quantity']) {
                        throw ValidationException::withMessages(["items.$i.quantity" => 'Pieces must be whole numbers.']);
                    }
                    $requested = $item['configuration'] ?? null;
                    if ($requested && ($requested['shape'] !== $format->geometry || $requested['finish'] !== $finish->simulation || array_filter(['width', 'height', 'thickness'], fn ($d) => (float) $requested[$d] !== (float) $item['dimensions_cm'][$d]))) {
                        throw ValidationException::withMessages(["items.$i.configuration" => 'Configuration does not match your selection.']);
                    }
                    $snapshots[] = ['product_id' => $p->id, 'product_snapshot' => ['id' => (string) $p->id, 'slug' => $p->slug, 'sku' => $p->sku, 'name' => $p->label($data['locale']), 'illustrative' => $p->illustrative],
                        'finish_snapshot' => ['id' => (string) $finish->id, 'slug' => $finish->slug, 'name' => $finish->label($data['locale']), 'simulation' => $finish->simulation],
                        'format_snapshot' => ['id' => (string) $format->id, 'geometry' => $format->geometry, 'name' => $format->label($data['locale']), 'verified' => (bool) $format->pivot->verified],
                        'configuration_snapshot' => ['version' => 1, 'geometry_selection' => $geometry, 'texture_media_id' => $p->texture_id ? (string) $p->texture_id : null, 'requested_visual' => $requested, 'saved_product_configuration' => $p->configuration?->only(['version', 'geometry', 'width', 'height', 'thickness', 'dimensions_verified', 'finish', 'scale', 'rotation', 'roughness', 'metalness', 'bump_strength', 'preset']), 'manufacturing_confirmation_required' => $custom || ! $format->pivot->verified || ($geometry && ! in_array($geometry['shape'], ['slab', 'tile', 'block'], true))],
                        ...$item['dimensions_cm'], 'quantity' => $item['quantity'], 'unit' => $item['unit'], 'custom_dimensions_requested' => $custom];
                }
                $q = new QuotationRequest(['uuid' => (string) Str::uuid(), 'reference' => 'TS-'.strtoupper(Str::random(16)), 'locale' => $data['locale'], 'customer_name' => $data['customer']['name'], 'email' => $data['customer']['email'], 'phone' => $data['customer']['phone'] ?? null, 'delivery_country' => $data['delivery']['country_code'], 'delivery_location' => $data['delivery']['location'], 'project_description' => $data['project_details'], 'privacy_acknowledged_at' => now(), 'submitted_at' => now(), 'status' => 'new']);
                $q->idempotency_key = $keyHash;
                $q->payload_hash = $hash;
                $q->save();
                $q->items()->createMany($snapshots);

                return $q;
            });
        } catch (UniqueConstraintViolationException $e) {
            $existing = QuotationRequest::where('idempotency_key', $keyHash)->first();
            if (! $existing) {
                throw $e;
            }

            return $respond($existing, true);
        }

        return $respond($quote);
    }
}
