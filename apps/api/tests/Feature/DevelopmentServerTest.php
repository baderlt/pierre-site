<?php

namespace Tests\Feature;

use App\Console\Commands\ServeDevelopment;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class DevelopmentServerTest extends TestCase
{
    public function test_both_startup_commands_use_the_project_upload_configuration(): void
    {
        $commands = Artisan::all();
        $this->assertInstanceOf(ServeDevelopment::class, $commands['serve']);
        $this->assertSame($commands['serve'], $commands['time-stone:serve']);
        $this->assertTrue($commands['serve']->getDefinition()->hasOption('host'));
        $this->assertTrue($commands['serve']->getDefinition()->hasOption('port'));
    }
}
