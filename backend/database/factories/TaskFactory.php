<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'category_id' => null,
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->optional()->paragraph(),
            'due_date' => $this->faker->optional()->dateTimeBetween('now', '+1 month')?->format('Y-m-d'),
            'status' => 'a_faire',
        ];
    }

    public function status(string $status): static
    {
        return $this->state(fn () => ['status' => $status]);
    }
}
