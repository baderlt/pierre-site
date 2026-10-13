<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class SettingsPolicy extends ContentPolicy
{
    public function viewAny(User $u): bool
    {
        return $u->isSuperAdmin();
    }

    public function delete(User $u, Model $m): bool
    {
        return false;
    }

    public function create(User $u): bool
    {
        return false;
    }
}
