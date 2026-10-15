<?php

namespace Tests\Unit;

use App\Domain\RetryingDatabaseStore;
use Illuminate\Cache\DatabaseLock;
use Illuminate\Database\MySqlConnection;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Cache;
use Mockery;
use PDOException;
use RuntimeException;
use Tests\TestCase;
use Throwable;

class DatabaseCacheTest extends TestCase
{
    private function store(array $results, int $transactionLevel = 0): RetryingDatabaseStore
    {
        $connection = Mockery::mock(MySqlConnection::class);
        $connection->shouldReceive('transactionLevel')->andReturn($transactionLevel);
        $builder = Mockery::mock(Builder::class);
        $index = 0;
        $builder->shouldReceive('insertOrIgnore')->times(count($results))->andReturnUsing(function ($record) use ($results, &$index) {
            $this->assertSame('qa:counter', $record['key']);
            $this->assertSame(serialize(0), $record['value']);
            $result = $results[$index++];
            if ($result instanceof Throwable) {
                throw $result;
            }

            return $result;
        });
        $connection->shouldReceive('table')->with('cache')->andReturn($builder);
        $store = Mockery::mock(RetryingDatabaseStore::class, [$connection, 'cache', 'qa:'])->makePartial();
        $store->shouldReceive('get')->with('counter')->times(count($results))->andReturnNull();

        return $store;
    }

    public function test_deadlock_is_retried_without_changing_the_added_value(): void
    {
        $store = $this->store([new PDOException('Concurrency failure', 40001), 1]);
        $this->assertTrue($store->add('counter', 0, 60));
    }

    public function test_losing_the_race_still_returns_false(): void
    {
        $store = $this->store([new PDOException('Concurrency failure', 40001), 0]);
        $this->assertFalse($store->add('counter', 0, 60));
    }

    public function test_unrelated_errors_are_not_retried(): void
    {
        $store = $this->store([new RuntimeException('Transport failure')]);
        $this->expectException(RuntimeException::class);
        $store->add('counter', 0, 60);
    }

    public function test_an_enclosing_transaction_is_never_retried(): void
    {
        $store = $this->store([new PDOException('Concurrency failure', 40001)], 1);
        $this->expectException(PDOException::class);
        $store->add('counter', 0, 60);
    }

    public function test_retries_are_bounded_and_failure_is_not_suppressed(): void
    {
        $store = $this->store(array_fill(0, 3, new PDOException('Concurrency failure', 40001)));
        $this->expectException(PDOException::class);
        $store->add('counter', 0, 60);
    }

    public function test_database_driver_preserves_prefix_and_database_locks(): void
    {
        $store = Cache::store('database')->getStore();
        $this->assertInstanceOf(RetryingDatabaseStore::class, $store);
        $this->assertSame(config('cache.prefix'), $store->getPrefix());
        $this->assertInstanceOf(DatabaseLock::class, $store->lock('qa-only', 5));
    }
}
