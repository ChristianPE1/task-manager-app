<?php

namespace App\Repositories\Interfaces;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

interface ProjectRepositoryInterface
{
    public function getAll(): Collection;
    
    public function getById(int $id): ?Project;
    
    public function create(array $data): Project;
    
    public function update(int $id, array $data): bool;
    
    public function delete(int $id): bool;
    
    public function getByOwner(int $userId): Collection;
}
