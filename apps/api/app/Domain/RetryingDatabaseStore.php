<?php

namespace App\Domain;

use Illuminate\Cache\DatabaseStore;
use Illuminate\Database\DetectsConcurrencyErrors;
use Throwable;

class RetryingDatabaseStore extends DatabaseStore
{
    use DetectsConcurrencyErrors;

    public function add($key, $value, $seconds)
    {
        // Concurrent rate-limit initialization can deadlock at INSERT IGNORE.
        // Retry this atomic cache operation only, never an enclosing transaction.
        return retry(3, fn () => parent::add($key, $value, $seconds), 20,
            fn (Throwable $error) => $this->connection->transactionLevel() === 0
                && $this->causedByConcurrencyError($error));
    }
}
