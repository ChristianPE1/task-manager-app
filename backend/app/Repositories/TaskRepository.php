<?php

namespace App\Repositories;

use App\Models\Task;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class TaskRepository implements TaskRepositoryInterface
{
    public function __construct(
        protected Task $model
    ) {}

    public function getAll(array $filters = []): Collection
    {
        $query = $this->model->with(['project', 'assignee']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (isset($filters['project_id'])) {
            $query->where('project_id', $filters['project_id']);
        }

        return $query->get();
    }

    public function getById(int $id): ?Task
    {
        return $this->model->with(['project', 'assignee'])->find($id);
    }

    public function create(array $data): Task
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        $task = $this->model->find($id);
        
        if (!$task) {
            return false;
        }
        
        return $task->update($data);
    }

    public function delete(int $id): bool
    {
        $task = $this->model->find($id);
        
        if (!$task) {
            return false;
        }
        
        return $task->delete();
    }

    public function getByProject(int $projectId): Collection
    {
        return $this->model->where('project_id', $projectId)
            ->with('assignee')
            ->get();
    }

    public function getByAssignee(int $userId, array $filters = []): Collection
    {
        $query = $this->model->where('assigned_to', $userId)
            ->with('project');

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        return $query->get();
    }
}
