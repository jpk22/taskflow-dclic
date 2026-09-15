<?php

use App\Models\User;

it('logs in with correct credentials and returns a token', function () {
    $user = User::factory()->create(['password' => bcrypt('password123')]);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    $response->assertOk()
        ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token']);
});

it('rejects login with an incorrect password', function () {
    $user = User::factory()->create(['password' => bcrypt('password123')]);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'mauvais-mot-de-passe',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors('email');
});

it('revokes the token on logout, blocking further authenticated requests', function () {
    $user = User::factory()->create();
    $token = $user->createToken('taskflow')->plainTextToken;

    $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson('/api/logout')
        ->assertOk();

    $this->withHeader('Authorization', "Bearer {$token}")
        ->getJson('/api/tasks')
        ->assertUnauthorized();
});

it('rejects unauthenticated access to protected routes', function () {
    $this->getJson('/api/tasks')->assertUnauthorized();
});
