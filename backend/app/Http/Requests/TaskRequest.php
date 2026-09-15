<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Ownership of the category (if any) is checked here; ownership of the
        // task itself (on update/delete) is enforced by TaskPolicy in the controller.
        return true;
    }

    public function rules(): array
    {
        // On update, fields are optional (sometimes) so a partial PUT (e.g. only
        // changing the status from the task list) does not fail validation.
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch');
        $req = $isUpdate ? 'sometimes' : 'required';

        return [
            'title' => [$req, 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'status' => [$req, Rule::in(['a_faire', 'en_cours', 'terminee'])],
            'category_id' => [
                'nullable',
                Rule::exists('categories', 'id')->where('user_id', $this->user()->id),
            ],
        ];
    }
}
