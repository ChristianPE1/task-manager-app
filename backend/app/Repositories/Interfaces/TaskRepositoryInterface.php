<?php

namespace App\Repositories\Interfaces;

use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

interface TaskRepositoryInterface
{
    public function getAll(array $filters = []): Collection;
    
    public function getById(int $id): ?Task;
    
    public function create(array $data): Task;
    
    public function update(int $id, array $data): bool;
    
    public function delete(int $id): bool;
    
    public function getByProject(int $projectId): Collection;
    
    public function getByAssignee(int $userId, array $filters = []): Collection;
}
