<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TaskController extends Controller
{
    public function __construct(
        protected TaskRepositoryInterface $taskRepository
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['project_id', 'status', 'priority']);
        $tasks = $this->taskRepository->getAll($filters);

        return response()->json([
            'data' => $tasks,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = $this->taskRepository->create($request->validated());

        return response()->json([
            'message' => 'Task created successfully',
            'data' => $task->load(['project:id,name', 'assignee:id,name,email']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $task = $this->taskRepository->getById($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json([
            'data' => $task,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, int $id): JsonResponse
    {
        $task = $this->taskRepository->getById($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        Gate::authorize('update', $task);

        $this->taskRepository->update($id, $request->validated());

        return response()->json([
            'message' => 'Task updated successfully',
            'data' => $this->taskRepository->getById($id),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $task = $this->taskRepository->getById($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        Gate::authorize('delete', $task);

        $this->taskRepository->delete($id);

        return response()->json([
            'message' => 'Task deleted successfully',
        ]);
    }
}
