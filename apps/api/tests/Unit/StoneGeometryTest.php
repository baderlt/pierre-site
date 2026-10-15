<?php

namespace Tests\Unit;

use App\Domain\StoneGeometry;
use Illuminate\Validation\ValidationException;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class StoneGeometryTest extends TestCase
{
    public static function validShapes(): array
    {
        return [['slab',['width'=>120,'height'=>80,'thickness'=>3]],['block',['width'=>100,'height'=>80,'thickness'=>60]],['tile',['width'=>60,'height'=>60,'thickness'=>1.5]],['square',['side'=>80,'thickness'=>3]],['circle',['diameter'=>120,'thickness'=>3]],['hexagon',['diameter'=>120,'thickness'=>3]],['triangle',['width'=>120,'height'=>80,'thickness'=>3]],['trapezoid',['width'=>120,'top_width'=>80,'height'=>80,'thickness'=>3]],['sector',['radius'=>60,'angle'=>270,'thickness'=>3]],['annular',['outer_radius'=>90,'inner_radius'=>60,'angle'=>180,'thickness'=>3]],['polygon',['vertices'=>[[0,0],[100,0],[120,60],[50,40],[0,80]],'thickness'=>3]]];
    }

    #[DataProvider('validShapes')]
    public function test_shapes_have_bounded_dimensions(string $shape, array $parameters): void
    {
        $g=new StoneGeometry;$p=$g->parameters($shape,$parameters);$d=$g->dimensions($shape,$p);
        $this->assertGreaterThanOrEqual(.5,$d['width']);$this->assertLessThanOrEqual(500,$d['height']);$this->assertSame((float)$parameters['thickness'],$d['thickness']);
    }

    public static function invalidShapes(): array
    {
        return [['circle',['diameter'=>0,'thickness'=>3]],['circle',['diameter'=>INF,'thickness'=>3]],['circle',['diameter'=>120,'thickness'=>3,'width'=>100]],['annular',['outer_radius'=>60,'inner_radius'=>60,'angle'=>90,'thickness'=>3]],['sector',['radius'=>60,'angle'=>360,'thickness'=>3]],['sector',['radius'=>30,'angle'=>.5,'thickness'=>3]],['polygon',['vertices'=>[[0,0],[100,100],[0,100],[100,0]],'thickness'=>3]],['polygon',['vertices'=>[[0,0],[100,0],[100,0],[0,100]],'thickness'=>3]],['polygon',['vertices'=>[[0,0],[50,0],[100,0]],'thickness'=>3]],['polygon',['vertices'=>[[0,0],[100,0],[500,100]],'thickness'=>3]]];
    }

    #[DataProvider('invalidShapes')]
    public function test_degenerate_and_unsafe_shapes_are_rejected(string $shape,array $parameters): void
    {
        $this->expectException(ValidationException::class);(new StoneGeometry)->parameters($shape,$parameters);
    }

    public function test_customization_respects_fixed_parameters_bounds_and_steps(): void
    {
        $g=new StoneGeometry;$p=['diameter'=>120,'thickness'=>3];$limits=$g->limits('circle',$p,['diameter'=>['min'=>60,'max'=>180,'default'=>120,'step'=>10]]);
        $this->assertSame(130.0,$g->parameters('circle',['diameter'=>130,'thickness'=>3],$limits,$p)['diameter']);
        foreach ([['diameter'=>135,'thickness'=>3],['diameter'=>190,'thickness'=>3],['diameter'=>130,'thickness'=>4]] as $bad) {try {$g->parameters('circle',$bad,$limits,$p);$this->fail('Invalid customization accepted');} catch(ValidationException){$this->assertTrue(true);}}
    }
}
