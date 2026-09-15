<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->categories()->orderBy('name')->get();
    }

    public function store(CategoryRequest $request)
    {
        $category = $request->user()->categories()->create($request->validated());

        return response()->json($category, 201);
    }

    public function update(CategoryRequest $request, Category $category)
    {
        $this->authorize('update', $category);

        $category->update($request->validated());

        return response()->json($category);
    }

    public function destroy(Request $request, Category $category)
    {
        $this->authorize('delete', $category);

        // Tasks referencing this category keep existing (category_id set to
        // null automatically thanks to the nullOnDelete() migration rule).
        $category->delete();

        return response()->json(null, 204);
    }
}
