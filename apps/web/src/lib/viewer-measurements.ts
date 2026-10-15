export type MeasurementAxis = 'width' | 'height' | 'thickness';
export type ScreenPoint = [number, number];
export type MeasurementFrame = { width: number; height: number; center: ScreenPoint; dimensions: Record<MeasurementAxis, number>; edges: { axis: MeasurementAxis; start: ScreenPoint; end: ScreenPoint }[] };

/** Screen-space callouts only: never alter geometry, exports or catalogue measurements. */
export function measurementGuides(frame: MeasurementFrame, locale: string, unit: string) {
  if (frame.width < 80 || frame.height < 80 || ![...frame.center, frame.width, frame.height].every(Number.isFinite)) return [];
  const guides: { axis: MeasurementAxis; start: ScreenPoint; end: ScreenPoint; originStart: ScreenPoint; originEnd: ScreenPoint; label: string; x: number; y: number; labelWidth: number }[] = [];
  const clamp = (n: number, low: number, high: number) => Math.max(low, Math.min(n, high));
  for (const edge of frame.edges) {
    const value = frame.dimensions[edge.axis];
    if (!Number.isFinite(value) || value <= 0 || ![...edge.start, ...edge.end].every(Number.isFinite)) continue;
    if ([edge.start, edge.end].some(p => p[0] < 0 || p[0] > frame.width || p[1] < 0 || p[1] > frame.height)) continue;
    const dx = edge.end[0] - edge.start[0], dy = edge.end[1] - edge.start[1], length = Math.hypot(dx, dy);
    if (length < .1) continue;
    let nx = -dy / length, ny = dx / length;
    const mx = (edge.start[0] + edge.end[0]) / 2, my = (edge.start[1] + edge.end[1]) / 2;
    if (nx * (mx - frame.center[0]) + ny * (my - frame.center[1]) < 0) { nx = -nx; ny = -ny; }
    const label = `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)} ${unit}`;
    const labelWidth = Math.min(frame.width - 24, Math.max(58, label.length * 6.5 + 16));
    let x = 0, y = 0;
    for (let attempt = 0; attempt < 8; attempt++) {
      x = clamp(mx + nx * (36 + attempt * 20), 12 + labelWidth / 2, frame.width - 12 - labelWidth / 2);
      y = clamp(my + ny * (36 + attempt * 20), 25, frame.height - 25);
      if (!guides.some(g => Math.abs(g.x - x) < (g.labelWidth + labelWidth) / 2 + 6 && Math.abs(g.y - y) < 30)) break;
    }
    const point = (p: ScreenPoint): ScreenPoint => [clamp(p[0] + nx * 18, 8, frame.width - 8), clamp(p[1] + ny * 18, 8, frame.height - 8)];
    guides.push({ axis: edge.axis, originStart: edge.start, originEnd: edge.end, start: point(edge.start), end: point(edge.end), label, x, y, labelWidth });
  }
  return guides;
}
