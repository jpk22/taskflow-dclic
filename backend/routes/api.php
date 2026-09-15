<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

// --- Authentification (non protégées) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- Routes protégées par Sanctum ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn (\Illuminate\Http\Request $request) => $request->user());

    Route::apiResource('categories', CategoryController::class)->except(['show']);
    Route::apiResource('tasks', TaskController::class);
});
