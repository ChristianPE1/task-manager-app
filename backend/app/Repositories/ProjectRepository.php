<?php

namespace App\Repositories;

use App\Models\Project;
use App\Repositories\Interfaces\ProjectRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ProjectRepository implements ProjectRepositoryInterface
{
    public function __construct(
        protected Project $model
    ) {}

    public function getAll(): Collection
    {
        return $this->model->with('owner')->get();
    }

    public function getById(int $id): ?Project
    {
        return $this->model->with(['owner', 'tasks'])->find($id);
    }

    public function create(array $data): Project
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        $project = $this->model->find($id);
        
        if (!$project) {
            return false;
        }
        
        return $project->update($data);
    }

    public function delete(int $id): bool
    {
        $project = $this->model->find($id);
        
        if (!$project) {
            return false;
        }
        
        return $project->delete();
    }

    public function getByOwner(int $userId): Collection
    {
        return $this->model->where('owner_id', $userId)->get();
    }
}
