<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        return ['slug' => fake()->unique()->slug(2), 'active' => true, 'sort_order' => 0];
    }

    public function configure(): static
    {
        return $this->afterCreating(fn ($c) => $c->translations()->create(['locale' => 'fr', 'name' => 'Catégorie illustrative']));
    }
}
