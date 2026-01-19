<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use App\Repositories\Interfaces\ProjectRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class ProjectController extends Controller
{
    public function __construct(
        protected ProjectRepositoryInterface $projectRepository
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $projects = $this->projectRepository->getAll();

        return response()->json([
            'data' => $projects,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = $this->projectRepository->create([
            ...$request->validated(),
            'owner_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Project created successfully',
            'data' => $project->load('owner:id,name,email'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $project = $this->projectRepository->getById($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        return response()->json([
            'data' => $project,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, int $id): JsonResponse
    {
        $project = $this->projectRepository->getById($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        Gate::authorize('update', $project);

        $this->projectRepository->update($id, $request->validated());

        return response()->json([
            'message' => 'Project updated successfully',
            'data' => $this->projectRepository->getById($id),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $project = $this->projectRepository->getById($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        Gate::authorize('delete', $project);

        $this->projectRepository->delete($id);

        return response()->json([
            'message' => 'Project deleted successfully',
        ]);
    }
}
