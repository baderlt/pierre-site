<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    public function createApplication()
    {
        $app = parent::createApplication();
        $this->verifyTestDatabase($app);

        return $app;
    }

    protected function verifyTestDatabase($app): void
    {
        // A connection URL can override the separate database field during connection parsing.
        if (! $app->environment('testing') || $app['config']->get('database.default') !== 'mysql'
            || $app['config']->get('database.connections.mysql.database') !== 'time_stone_test'
            || (string) $app['config']->get('database.connections.mysql.url') !== '') {
            throw new \RuntimeException('Tests require testing environment, dedicated MySQL time_stone_test and no connection URL override.');
        }
    }
}
