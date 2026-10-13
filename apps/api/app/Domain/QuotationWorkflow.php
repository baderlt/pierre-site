<?php

namespace App\Domain;

use App\Models\QuotationRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

class QuotationWorkflow
{
    public function update(QuotationRequest $quote, array $data): QuotationRequest
    {
        Gate::authorize('update', $quote);
        $values = Validator::make($data, ['status' => 'required|in:new,in_review,replied,closed', 'internal_notes' => 'nullable|string|max:20000', 'assigned_to' => 'nullable|exists:users,id'])->validate();

        return DB::transaction(function () use ($quote, $values) {
            $quote = QuotationRequest::lockForUpdate()->findOrFail($quote->id);
            if ($quote->status !== $values['status']) {
                $quote->statusEvents()->create(['user_id' => auth()->id(), 'from_status' => $quote->status, 'to_status' => $values['status']]);
            }
            $quote->update($values);

            return $quote->refresh();
        });
    }
}
