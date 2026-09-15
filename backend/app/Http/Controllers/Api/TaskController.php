<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        // eager-load category to avoid N+1 queries when the front-end
        // displays the category name on each task card.
        $query = $request->user()->tasks()->with('category');

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->string('search') . '%');
        }

        return $query
            ->orderBy('due_date')
            ->orderByDesc('created_at')
            ->paginate(20);
    }

    public function store(TaskRequest $request)
    {
        $task = $request->user()->tasks()->create($request->validated());

        return response()->json($task->load('category'), 201);
    }

    public function show(Request $request, Task $task)
    {
        $this->authorize('view', $task);

        return $task->load('category');
    }

    public function update(TaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);

        $task->update($request->validated());

        return response()->json($task->load('category'));
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $task->delete();

        return response()->json(null, 204);
    }
}
