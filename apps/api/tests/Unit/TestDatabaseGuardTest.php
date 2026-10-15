<?php

namespace Tests\Unit;

use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class TestDatabaseGuardTest extends TestCase
{
    public static function unsafeConfigurations(): array
    {
        return [
            'URL overrides otherwise safe name' => ['database.connections.mysql.url', 'mysql://example.invalid/business'],
            'whitespace URL override' => ['database.connections.mysql.url', ' '],
            'business database' => ['database.connections.mysql.database', 'time_stone'],
            'another database with a test suffix' => ['database.connections.mysql.database', 'business_test'],
            'different driver' => ['database.default', 'sqlite'],
        ];
    }

    #[DataProvider('unsafeConfigurations')]
    public function test_guard_rejects_unsafe_configuration_before_connecting(string $key, string $value): void
    {
        config([$key => $value]);
        $this->expectException(\RuntimeException::class);
        $this->verifyTestDatabase($this->app);
    }
}
