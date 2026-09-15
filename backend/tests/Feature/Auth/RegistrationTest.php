<?php

use App\Models\User;

it('registers a new user and returns a token', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Jean Dupont',
        'email' => 'jean@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertCreated()
        ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token']);

    $this->assertDatabaseHas('users', ['email' => 'jean@example.com']);
});

it('rejects registration with a mismatched password confirmation', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Jean Dupont',
        'email' => 'jean@example.com',
        'password' => 'password123',
        'password_confirmation' => 'autrechose',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors('password');
});

it('rejects registration with an email already used', function () {
    User::factory()->create(['email' => 'jean@example.com']);

    $response = $this->postJson('/api/register', [
        'name' => 'Jean Dupont',
        'email' => 'jean@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors('email');
});
