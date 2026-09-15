<?php

use App\Models\Category;
use App\Models\Task;
use App\Models\User;

it('lists only the authenticated user\'s tasks', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    Task::factory()->count(2)->create(['user_id' => $user->id]);
    Task::factory()->count(4)->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->getJson('/api/tasks');

    $response->assertOk()->assertJsonCount(2, 'data');
});

it('filters tasks by status', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->status('a_faire')->count(2)->create();
    Task::factory()->for($user)->status('terminee')->count(3)->create();

    $response = $this->actingAs($user)->getJson('/api/tasks?status=terminee');

    $response->assertOk()->assertJsonCount(3, 'data');
});

it('filters tasks by category', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->create();
    Task::factory()->for($user)->create(['category_id' => $category->id]);
    Task::factory()->for($user)->count(2)->create(['category_id' => null]);

    $response = $this->actingAs($user)->getJson("/api/tasks?category_id={$category->id}");

    $response->assertOk()->assertJsonCount(1, 'data');
});

it('searches tasks by keyword in the title', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->create(['title' => 'Préparer la présentation']);
    Task::factory()->for($user)->create(['title' => 'Acheter du pain']);

    $response = $this->actingAs($user)->getJson('/api/tasks?search=présentation');

    $response->assertOk()->assertJsonCount(1, 'data');
});

it('creates a task for the authenticated user', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/tasks', [
        'title' => 'Nouvelle tâche',
        'status' => 'a_faire',
    ]);

    $response->assertCreated()->assertJsonFragment(['title' => 'Nouvelle tâche']);
    $this->assertDatabaseHas('tasks', ['title' => 'Nouvelle tâche', 'user_id' => $user->id]);
});

it('rejects a task with an invalid status', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/tasks', ['title' => 'Tâche', 'status' => 'inexistant'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('status');
});

it('rejects assigning a task to another user\'s category', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $foreignCategory = Category::factory()->for($otherUser)->create();

    $this->actingAs($user)
        ->postJson('/api/tasks', [
            'title' => 'Tâche',
            'status' => 'a_faire',
            'category_id' => $foreignCategory->id,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('category_id');
});

it('lets the owner update a task\'s status', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->status('a_faire')->create();

    $this->actingAs($user)
        ->putJson("/api/tasks/{$task->id}", ['status' => 'en_cours'])
        ->assertOk()
        ->assertJsonFragment(['status' => 'en_cours']);
});

it('prevents a user from viewing another user\'s task', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $task = Task::factory()->for($owner)->create();

    $this->actingAs($intruder)
        ->getJson("/api/tasks/{$task->id}")
        ->assertForbidden();
});

it('prevents a user from updating another user\'s task', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $task = Task::factory()->for($owner)->create();

    $this->actingAs($intruder)
        ->putJson("/api/tasks/{$task->id}", ['status' => 'terminee'])
        ->assertForbidden();
});

it('prevents a user from deleting another user\'s task', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $task = Task::factory()->for($owner)->create();

    $this->actingAs($intruder)
        ->deleteJson("/api/tasks/{$task->id}")
        ->assertForbidden();

    $this->assertDatabaseHas('tasks', ['id' => $task->id]);
});

it('lets the owner delete their task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();

    $this->actingAs($user)
        ->deleteJson("/api/tasks/{$task->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
});

it('keeps the task but clears its category when that category is deleted', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->create();
    $task = Task::factory()->for($user)->create(['category_id' => $category->id]);

    $this->actingAs($user)->deleteJson("/api/categories/{$category->id}")->assertNoContent();

    $this->assertDatabaseHas('tasks', ['id' => $task->id, 'category_id' => null]);
});
