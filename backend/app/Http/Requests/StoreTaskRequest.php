<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'status' => ['sometimes', Rule::in(['pending', 'in_progress', 'done', 'overdue'])],
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'due_date' => 'required|date|after_or_equal:today',
            'assigned_to' => 'required|exists:users,id',
        ];
    }
}
