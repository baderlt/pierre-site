<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class QuotationRequestFactory extends Factory
{
    public function definition(): array
    {
        return ['uuid' => (string) Str::uuid(), 'reference' => 'QA-'.Str::upper(Str::random(12)), 'locale' => 'fr', 'customer_name' => 'QA ONLY · Synthetic enquiry', 'email' => 'qa@example.test', 'delivery_country' => 'MA', 'delivery_location' => 'QA fixture', 'project_description' => 'Synthetic test data; no real customer.', 'privacy_acknowledged_at' => now(), 'submitted_at' => now(), 'status' => 'new', 'internal_notes' => 'PRIVATE QUOTE NOTES'];
    }
}
