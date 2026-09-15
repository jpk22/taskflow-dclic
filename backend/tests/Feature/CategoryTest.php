<?php

use App\Models\Category;
use App\Models\User;

it('lists only the authenticated user\'s categories', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    Category::factory()->count(2)->create(['user_id' => $user->id]);
    Category::factory()->count(3)->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->getJson('/api/categories');

    $response->assertOk()->assertJsonCount(2);
});

it('creates a category for the authenticated user', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/categories', ['name' => 'Travail']);

    $response->assertCreated()->assertJsonFragment(['name' => 'Travail']);
    $this->assertDatabaseHas('categories', ['name' => 'Travail', 'user_id' => $user->id]);
});

it('rejects creating a category without a name', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/categories', ['name' => ''])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('name');
});

it('lets the owner update their category', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/categories/{$category->id}", ['name' => 'Maison'])
        ->assertOk()
        ->assertJsonFragment(['name' => 'Maison']);
});

it('prevents a user from updating another user\'s category', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $category = Category::factory()->create(['user_id' => $owner->id]);

    $this->actingAs($intruder)
        ->putJson("/api/categories/{$category->id}", ['name' => 'Piraté'])
        ->assertForbidden();
});

it('prevents a user from deleting another user\'s category', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $category = Category::factory()->create(['user_id' => $owner->id]);

    $this->actingAs($intruder)
        ->deleteJson("/api/categories/{$category->id}")
        ->assertForbidden();

    $this->assertDatabaseHas('categories', ['id' => $category->id]);
});

it('lets the owner delete their category', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->deleteJson("/api/categories/{$category->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
});
