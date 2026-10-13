<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class UserPolicy extends SettingsPolicy
{
    public function create(User $u): bool
    {
        return $u->isSuperAdmin();
    }

    public function delete(User $u, Model $m): bool
    {
        return false;
    }
}
