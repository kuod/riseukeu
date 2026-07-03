// Deterministic seeded PRNG (mulberry32) so hexagon rotation is stable across renders.
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

// Flat-top hexagon per territory, with a small seeded rotation jitter so a
// dense cluster doesn't look perfectly machine-tiled.
export function hexPoints(cx: number, cy: number, rx: number, ry: number, seed: number): string {
  const rand = mulberry32(seed * 7919 + 3);
  const rotationJitter = (rand() - 0.5) * 0.15;
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 6 + rotationJitter;
    const x = cx + Math.cos(angle) * rx;
    const y = cy + Math.sin(angle) * ry;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(' ');
}
