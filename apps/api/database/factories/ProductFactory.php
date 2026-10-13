<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\StoneType;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return ['slug' => fake()->unique()->slug(3), 'category_id' => Category::factory(), 'stone_type_id' => StoneType::factory(), 'status' => 'draft', 'illustrative' => true, 'sort_order' => 0];
    }

    public function published(): static
    {
        return $this->state(fn () => ['status' => 'published', 'published_at' => now()]);
    }

    public function configure(): static
    {
        return $this->afterCreating(fn ($c) => $c->translations()->create(['locale' => 'fr', 'name' => 'Étude de pierre']));
    }
}
