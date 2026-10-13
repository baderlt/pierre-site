<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

class ProvisionAdmin extends Command
{
    protected $signature = 'time-stone:admin {email} {--name=} {--role=super_admin}';

    protected $description = 'Provision an administrator using a hidden password prompt.';

    public function handle(): int
    {
        $email = $this->argument('email');
        $name = $this->option('name') ?: $this->ask('Administrator name');
        $password = $this->secret('Password (minimum 14 characters)');
        $confirmation = $this->secret('Confirm password');
        $values = Validator::make(['email' => $email, 'name' => $name, 'password' => $password, 'password_confirmation' => $confirmation, 'role' => $this->option('role')], ['email' => 'required|email|max:254|unique:users', 'name' => 'required|string|max:150', 'password' => 'required|string|min:14|max:128|confirmed', 'role' => 'required|in:super_admin,content_manager'])->validate();
        unset($values['password_confirmation']);
        User::forceCreate([...$values, 'active' => true]);
        $this->info('Administrator provisioned. Sign in at /admin.');

        return self::SUCCESS;
    }
}
