<?php

return ['paths' => ['api/*', 'media/*'], 'allowed_methods' => ['GET', 'HEAD', 'POST', 'OPTIONS'], 'allowed_origins' => [env('WEBSITE_ORIGIN', 'http://localhost:3000')], 'allowed_origins_patterns' => [], 'allowed_headers' => ['Content-Type', 'Accept', 'Idempotency-Key'], 'exposed_headers' => [], 'max_age' => 600, 'supports_credentials' => false];
