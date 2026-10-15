<?php

namespace App\Domain;

use Illuminate\Validation\ValidationException;

/** Bounded, planar outlines in centimeters. The browser independently rebuilds them. */
class StoneGeometry
{
    public const FIELDS = [
        'slab' => ['width', 'height', 'thickness'], 'block' => ['width', 'height', 'thickness'], 'tile' => ['width', 'height', 'thickness'],
        'square' => ['side', 'thickness'], 'circle' => ['diameter', 'thickness'], 'hexagon' => ['diameter', 'thickness'],
        'triangle' => ['width', 'height', 'thickness'], 'trapezoid' => ['width', 'top_width', 'height', 'thickness'],
        'sector' => ['radius', 'angle', 'thickness'], 'annular' => ['inner_radius', 'outer_radius', 'angle', 'thickness'],
        'polygon' => ['vertices', 'thickness'],
    ];

    public function parameters(string $shape, array $parameters, array $limits = [], ?array $fixed = null): array
    {
        $keys = self::FIELDS[$shape] ?? $this->fail('Unknown geometry.');
        if (array_diff(array_keys($parameters), $keys) || array_diff($keys, array_keys($parameters))) {
            $this->fail('Supply exactly the parameters supported by this geometry.');
        }
        foreach ($keys as $key) {
            if ($key === 'vertices') {
                $this->polygon($parameters[$key]);
                if ($fixed && $parameters[$key] !== $fixed[$key]) {
                    $this->fail('Customer polygon outline editing is not supported.');
                }
                continue;
            }
            $value = $parameters[$key];
            $max = $key === 'angle' ? 359 : (str_contains($key, 'radius') ? 250 : 500);
            if (! is_numeric($value) || ! is_finite((float) $value) || $value < .5 || $value > $max || abs((float) $value * 100 - round((float) $value * 100)) > .00001) {
                $this->fail('Geometry parameters must be finite, bounded values with at most two decimals.');
            }
            $parameters[$key] = (float) $value;
            if (isset($limits[$key])) {
                $l = $limits[$key];
                if ($value < $l['min'] - .00001 || $value > $l['max'] + .00001 || abs(($value - $l['default']) / $l['step'] - round(($value - $l['default']) / $l['step'])) > .00001) {
                    $this->fail('Dimension is outside its approved range or step.');
                }
            } elseif ($fixed && abs($parameters[$key] - $fixed[$key]) > .00001) {
                $this->fail('These dimensions are fixed by the administrator.');
            }
        }
        if ($shape === 'annular' && $parameters['outer_radius'] - $parameters['inner_radius'] < .5) {
            $this->fail('Outer radius must exceed inner radius by at least 0.5 cm.');
        }
        $this->dimensions($shape, $parameters);

        return $parameters;
    }

    public function limits(string $shape, array $parameters, array $limits): array
    {
        $allowed = array_values(array_diff(self::FIELDS[$shape] ?? [], ['vertices']));
        if (array_diff(array_keys($limits), $allowed)) {
            $this->fail('Unsupported customer dimension parameter.');
        }
        foreach ($limits as $key => $l) {
            if (! is_array($l) || count($l) !== 4 || array_diff(['min', 'max', 'default', 'step'], array_keys($l))) {
                $this->fail('Each dimension needs minimum, maximum, default and step.');
            }
            foreach ($l as $v) {
                if (! is_numeric($v) || ! is_finite((float) $v)) {
                    $this->fail('Dimension limits must be finite numbers.');
                }
            }
            $max = $key === 'angle' ? 359 : (str_contains($key, 'radius') ? 250 : 500);
            if ($l['min'] < .5 || $l['max'] > $max || $l['max'] < $l['min'] || $l['step'] < .01 || $l['step'] > 500 || abs($l['default'] - $parameters[$key]) > .00001 || $l['default'] < $l['min'] || $l['default'] > $l['max']) {
                $this->fail('Invalid dimension limits or default.');
            }
            foreach ($l as $v) if(abs($v*100-round($v*100))>.00001)$this->fail('Dimension limits support two decimal places.');
            foreach (['default','max'] as $field) if(abs(($l[$field]-$l['min'])/$l['step']-round(($l[$field]-$l['min'])/$l['step']))>.00001)$this->fail('Default and maximum must align with the minimum and step.');
            $limits[$key] = array_map('floatval', $l);
        }
        $this->parameters($shape, $parameters, $limits);

        return $limits;
    }

    public function outline(string $shape, array $p): array
    {
        if (in_array($shape, ['slab', 'block', 'tile', 'square'], true)) {
            $w = $p['side'] ?? $p['width'];$h = $p['side'] ?? $p['height'];
            return [[0, 0], [$w, 0], [$w, $h], [0, $h]];
        }
        if ($shape === 'triangle') return [[0, 0], [$p['width'], 0], [$p['width'] / 2, $p['height']]];
        if ($shape === 'trapezoid') return [[0, 0], [$p['width'], 0], [($p['width'] + $p['top_width']) / 2, $p['height']], [($p['width'] - $p['top_width']) / 2, $p['height']]];
        if ($shape === 'polygon') return $p['vertices'];
        $n = $shape === 'hexagon' ? 6 : 64;
        $angle = isset($p['angle']) ? deg2rad($p['angle']) : 2 * M_PI;
        $r = $p['outer_radius'] ?? $p['radius'] ?? $p['diameter'] / 2;
        $points = [];$angles=[];
        for ($i = 0; $i <= ($shape === 'hexagon' || $shape === 'circle' ? $n - 1 : $n); $i++) $angles[]=$angle*$i/$n;
        if(in_array($shape,['sector','annular'],true))foreach([M_PI/2,M_PI,3*M_PI/2]as$a)if($a<$angle&&!collect($angles)->contains(fn($v)=>abs($v-$a)<.000000001))$angles[]=$a;
        sort($angles);foreach($angles as$a)$points[]=[$r*cos($a),$r*sin($a)];
        if ($shape === 'sector') $points[] = [0, 0];
        if ($shape === 'annular') {
            foreach(array_reverse($angles)as$a)$points[] = [$p['inner_radius'] * cos($a), $p['inner_radius'] * sin($a)];
        }
        return $points;
    }

    public function dimensions(string $shape, array $p): array
    {
        $points = $this->outline($shape, $p);
        $w = max(array_column($points, 0)) - min(array_column($points, 0));
        $h = max(array_column($points, 1)) - min(array_column($points, 1));
        // Round display bounds up to 0.01cm; these are model bounds, not manufacturing claims.
        if (min($w, $h) < .5 || max($w, $h) > 500.00001) $this->fail('Geometry bounds must be between 0.5 and 500 cm.');
        return ['width' => ceil($w * 100 - .000001) / 100, 'height' => ceil($h * 100 - .000001) / 100, 'thickness' => (float) $p['thickness']];
    }

    public function polygon(mixed $points): void
    {
        if (! is_array($points) || count($points) < 3 || count($points) > 32 || ! array_is_list($points)) $this->fail('Polygon needs 3–32 ordered vertices.');
        foreach ($points as $p) {
            if (! is_array($p) || count($p) !== 2 || ! array_is_list($p) || ! is_numeric($p[0]) || ! is_numeric($p[1]) || ! is_finite((float) $p[0]) || ! is_finite((float) $p[1]) || abs($p[0]) > 250 || abs($p[1]) > 250) $this->fail('Invalid polygon coordinate.');
        }
        $cross = fn ($a, $b, $c) => ($b[0] - $a[0]) * ($c[1] - $a[1]) - ($b[1] - $a[1]) * ($c[0] - $a[0]);
        $n = count($points);$area = 0;
        for ($i = 0; $i < $n; $i++) {
            $a = $points[$i];$b = $points[($i + 1) % $n];
            if (hypot($b[0] - $a[0], $b[1] - $a[1]) < .01 || abs($cross($points[($i + $n - 1) % $n], $a, $b)) < .000001) $this->fail('Duplicate or collinear polygon edges.');
            $area += $a[0] * $b[1] - $b[0] * $a[1];
            for ($j = $i + 1; $j < $n; $j++) {
                if ($j === $i + 1 || ($i === 0 && $j === $n - 1)) continue;
                $c = $points[$j];$d = $points[($j + 1) % $n];
                if ($cross($a, $b, $c) * $cross($a, $b, $d) <= .00000001 && $cross($c, $d, $a) * $cross($c, $d, $b) <= .00000001 && max(min($a[0], $b[0]), min($c[0], $d[0])) <= min(max($a[0], $b[0]), max($c[0], $d[0])) + .000001 && max(min($a[1], $b[1]), min($c[1], $d[1])) <= min(max($a[1], $b[1]), max($c[1], $d[1])) + .000001) $this->fail('Self-intersecting polygon.');
            }
        }
        if (abs($area) < .5) $this->fail('Degenerate polygon area.');
    }

    private function fail(string $message): never
    {
        throw ValidationException::withMessages(['configuration.shape' => $message]);
    }
}
