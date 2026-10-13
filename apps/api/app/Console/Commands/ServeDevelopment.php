<?php

namespace App\Console\Commands;

use Illuminate\Foundation\Console\ServeCommand;

class ServeDevelopment extends ServeCommand
{
    public function __construct()
    {
        parent::__construct();
        $this->setName('serve');
        $this->setAliases(['time-stone:serve']);
        $this->setDescription('Serve TIME STONE locally with its image upload limits');
    }

    protected function serverCommand(): array
    {
        $command = parent::serverCommand();

        // Set limits on the HTTP child process; flags on artisan itself are not inherited.
        array_splice($command, 1, 0, ['-d', 'upload_max_filesize=10M', '-d', 'post_max_size=128M', '-d', 'memory_limit=256M']);

        return $command;
    }
}
