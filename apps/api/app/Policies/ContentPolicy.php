<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class ContentPolicy
{
    public function viewAny(User $u): bool
    {
        return $u->active && in_array($u->role, ['super_admin', 'content_manager'], true);
    }

    public function view(User $u, Model $m): bool
    {
        return $this->viewAny($u);
    }

    public function create(User $u): bool
    {
        return $this->viewAny($u);
    }

    public function update(User $u, Model $m): bool
    {
        return $this->viewAny($u);
    }

    public function delete(User $u, Model $m): bool
    {
        return $this->viewAny($u);
    }

    public function deleteAny(User $u): bool
    {
        return false;
    }
}
