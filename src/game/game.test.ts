import { describe, it, expect } from 'vitest';
import { TERRITORIES, TERRITORY_MAP } from './map-data';
import { createGame } from './setup';
import { applyAction } from './reducer';
import type { GameState } from './types';

function twoPlayer(): GameState {
  return createGame([
    { name: 'A', type: 'human' },
    { name: 'B', type: 'human' },
  ]);
}

describe('map data', () => {
  it('has 42 territories with symmetric, valid adjacency', () => {
    expect(TERRITORIES).toHaveLength(42);
    for (const t of TERRITORIES) {
      for (const n of t.adjacent) {
        expect(TERRITORY_MAP[n], `${t.id} -> ${n}`).toBeDefined();
        expect(TERRITORY_MAP[n].adjacent, `${n} should link back to ${t.id}`).toContain(t.id);
      }
    }
  });
});

