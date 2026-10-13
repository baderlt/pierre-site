<?php
// Local CLI query budget measurement; not a VPS or HTTP load benchmark.
use Illuminate\Support\Facades\{DB,Cache};
use Illuminate\Http\Request;
use Illuminate\Support\Str;
require __DIR__.'/../apps/api/vendor/autoload.php';
$app=require __DIR__.'/../apps/api/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
if (!app()->environment(['local','testing'])) throw new RuntimeException('Benchmarks are local/testing only.');
Cache::forever('public-content-version',(string)Str::uuid());
$count=0; $databaseMs=0;
DB::listen(function($query) use(&$count,&$databaseMs) { $count++; $databaseMs+=$query->time; });
$kernel=$app->make(Illuminate\Contracts\Http\Kernel::class); $results=[];
foreach(['/api/v1/products?locale=fr&per_page=12','/api/v1/products?locale=fr&per_page=48','/api/v1/products/sample-1?locale=ar','/api/v1/materials?locale=en','/api/v1/pages/about?locale=fr'] as $url) foreach(['cold','warm'] as $state) {
    $count=0; $databaseMs=0; $start=hrtime(true); $request=Request::create($url,'GET',server:['HTTP_ACCEPT'=>'application/json']);
    $response=$kernel->handle($request); $elapsed=(hrtime(true)-$start)/1e6; $kernel->terminate($request,$response);
    if($response->getStatusCode()!==200) throw new RuntimeException('Benchmark route failed: '.$url);
    $results[]=['path'=>$url,'cache'=>$state,'queries'=>$count,'database_ms'=>round($databaseMs,2),'in_process_ms'=>round($elapsed,2),'response_bytes'=>strlen($response->getContent())];
}
$report=['measured_at'=>gmdate('c'),'runtime'=>PHP_VERSION,'database'=>'MySQL','scope'=>'Local CLI kernel; first request includes framework initialization. Not HTTP throughput or production capacity.','results'=>$results];
file_put_contents(__DIR__.'/../'.(getenv('QA_OUTPUT_DIR') ?: 'docs/qa/milestone-5').'/backend-query-measurements.json',json_encode($report,JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES));
echo json_encode($report,JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES)."\n";
