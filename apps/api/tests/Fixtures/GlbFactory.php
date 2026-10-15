<?php

namespace Tests\Fixtures;

class GlbFactory
{
    public static function make(?callable $change = null): string
    {
        $positions = [0,0,0, 1.2,0,0, 1.2,.8,0, 0,.8,0, 0,0,.03, 1.2,0,.03, 1.2,.8,.03, 0,.8,.03];
        $indices = [0,2,1,0,3,2,4,5,6,4,6,7,0,1,5,0,5,4,3,7,6,3,6,2,0,4,7,0,7,3,1,2,6,1,6,5];
        $bin = pack('g*', ...$positions).pack('v*', ...$indices);
        $json = ['asset'=>['version'=>'2.0'],'scene'=>0,'scenes'=>[['nodes'=>[0]]],'nodes'=>[['mesh'=>0]],'buffers'=>[['byteLength'=>strlen($bin)]],
            'bufferViews'=>[['buffer'=>0,'byteOffset'=>0,'byteLength'=>96],['buffer'=>0,'byteOffset'=>96,'byteLength'=>72]],
            'accessors'=>[['bufferView'=>0,'componentType'=>5126,'count'=>8,'type'=>'VEC3','min'=>[0,0,0],'max'=>[1.2,.8,.03]],['bufferView'=>1,'componentType'=>5123,'count'=>18,'type'=>'SCALAR'],['bufferView'=>1,'byteOffset'=>36,'componentType'=>5123,'count'=>18,'type'=>'SCALAR']],
            'meshes'=>[['primitives'=>[['attributes'=>['POSITION'=>0],'indices'=>1,'material'=>0],['attributes'=>['POSITION'=>0],'indices'=>2,'material'=>1]]]],
            'materials'=>[['name'=>'Top red','pbrMetallicRoughness'=>['baseColorFactor'=>[.8,.1,.1,1],'metallicFactor'=>0,'roughnessFactor'=>.25]],['name'=>'Edge limestone','pbrMetallicRoughness'=>['baseColorFactor'=>[.7,.6,.4,1],'metallicFactor'=>0,'roughnessFactor'=>.8]]]];
        if ($change) $change($json, $bin);
        $text = json_encode($json, JSON_UNESCAPED_SLASHES);$text .= str_repeat(' ', (4 - strlen($text) % 4) % 4);$bin .= str_repeat("\0", (4 - strlen($bin) % 4) % 4);
        return pack('V*',0x46546c67,2,28+strlen($text)+strlen($bin),strlen($text),0x4e4f534a).$text.pack('V*',strlen($bin),0x004e4942).$bin;
    }
}
