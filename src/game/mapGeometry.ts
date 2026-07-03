// Deterministic seeded PRNG (mulberry32) so blob shapes are stable across renders.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function blobPoints(cx: number, cy: number, rx: number, ry: number, seed: number, count = 10): string {
  const rand = mulberry32(seed * 9973 + 17);
  const points: string[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const jitter = 0.75 + rand() * 0.5;
    const x = cx + Math.cos(angle) * rx * jitter;
    const y = cy + Math.sin(angle) * ry * jitter;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(' ');
}
