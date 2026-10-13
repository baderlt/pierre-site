<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    public function createApplication()
    {
        $app = parent::createApplication();
        if ($app['config']->get('database.default') !== 'mysql' || ! str_ends_with($app['config']->get('database.connections.mysql.database'), '_test')) {
            throw new \RuntimeException('Tests require an isolated MySQL database ending in _test.');
        }

        return $app;
    }
}
