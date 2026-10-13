<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class QuotationPolicy extends ContentPolicy
{
    public function create(User $u): bool
    {
        return false;
    }

    public function delete(User $u, Model $m): bool
    {
        return false;
    }
}
