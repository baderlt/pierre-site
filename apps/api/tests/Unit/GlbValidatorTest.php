<?php

namespace Tests\Unit;

use App\Domain\GlbValidator;
use Illuminate\Validation\ValidationException;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\GlbFactory;
use Tests\TestCase;

class GlbValidatorTest extends TestCase
{
    public function test_sanitized_derivative_also_obeys_the_delivery_byte_budget(): void
    {
        $original=GlbFactory::make();$length=unpack('V',substr($original,12,4))[1];$json=json_decode(substr($original,20,$length),true);$bin=substr($original,28+$length);
        $json['asset']['custom']=str_repeat('石',100000);$bin=str_pad($bin,7900000,"\0");$json['buffers'][0]['byteLength']=strlen($bin);$encoded=json_encode($json,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);$encoded.=str_repeat(' ',(4-strlen($encoded)%4)%4);
        $bytes=pack('V*',0x46546c67,2,28+strlen($encoded)+strlen($bin),strlen($encoded),0x4e4f534a).$encoded.pack('V*',strlen($bin),0x004e4942).$bin;
        $this->assertLessThan(GlbValidator::MAX_BYTES,strlen($bytes));$this->expectException(ValidationException::class);(new GlbValidator)->validate($bytes);
    }

    public function test_static_material_assignments_survive_validated_derivative(): void
    {
        $v=(new GlbValidator)->validate(GlbFactory::make(fn (&$j)=>$j['extras']=['private'=>'metadata']));
        $this->assertSame(2,$v['metadata']['materials']);$this->assertSame(12,$v['metadata']['triangles']);$this->assertEqualsWithDelta(120,$v['metadata']['dimensions_cm']['width'],.01);
        $n=unpack('V',substr($v['bytes'],12,4))[1];$j=json_decode(substr($v['bytes'],20,$n),true);$this->assertArrayNotHasKey('extras',$j);$this->assertSame([0,1],array_column($j['meshes'][0]['primitives'],'material'));$this->assertSame('Top red',$j['materials'][0]['name']);
    }

    public static function invalidModels(): array
    {
        return [['external'],['extension'],['indices'],['cycle'],['stride'],['count'],['sparse'],['animation'],['float'],['length'],['json'],['many'],['matrix'],['unreachable'],['undeclared'],['bounds'],['material-type'],['required-extension'],['instanced-budget']];
    }

    #[DataProvider('invalidModels')]
    public function test_malformed_unsafe_or_over_budget_models_are_rejected(string $case): void
    {
        $bytes=GlbFactory::make(function(&$j,&$bin)use($case){
            switch($case){
                case 'external':$j['buffers'][0]['uri']='https://evil.invalid/mesh.bin';break;
                case 'extension':$j['extensionsUsed']=['KHR_draco_mesh_compression'];break;
                case 'indices':$bin=substr_replace($bin,pack('v',99),96,2);break;
                case 'cycle':$j['nodes'][0]['children']=[0];break;
                case 'stride':$j['bufferViews'][0]['byteStride']=256;break;
                case 'count':$j['accessors'][0]['count']=100000000;break;
                case 'sparse':$j['accessors'][0]['sparse']=[];break;
                case 'animation':$j['animations']=[['channels'=>[]]];break;
                case 'float':$bin=substr_replace($bin,pack('V',0x7fc00000),0,4);break;
                case 'many':$j['materials']=array_fill(0,33,$j['materials'][0]);break;
                case 'matrix':$j['nodes'][0]['matrix']=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];$j['nodes'][0]['translation']=[0,0,0];break;
                case 'unreachable':$j['nodes'][]=['mesh'=>0];break;
                case 'undeclared':$j['materials'][0]['extensions']=['KHR_materials_clearcoat'=>['clearcoatFactor'=>.5]];break;
                case 'bounds':$j['accessors'][0]['max'][0]=4;break;
                case 'material-type':$j['materials'][0]['pbrMetallicRoughness']['roughnessFactor']='0.5';break;
                case 'required-extension':$j['extensionsRequired']=['KHR_materials_clearcoat'];break;
                case 'instanced-budget':$j['nodes']=array_fill(0,65,['mesh'=>0]);$j['scenes'][0]['nodes']=range(0,64);break;
            }
        });
        if($case==='length')$bytes=substr($bytes,0,-4);
        if($case==='json')$bytes=substr_replace($bytes,'[',20,1);
        $this->expectException(ValidationException::class);(new GlbValidator)->validate($bytes);
    }
}
