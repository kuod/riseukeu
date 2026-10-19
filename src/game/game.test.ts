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

describe('reducer', () => {
  it('rejects SELECT_ATTACK while a conquest awaits its capture move', () => {
    const s = twoPlayer();
    const a = 'alaska';
    const b = 'alberta';
    const c = 'kamchatka';
    const state: GameState = {
      ...s,
      phase: 'attack',
      currentPlayerIndex: 0,
      territories: {
        ...s.territories,
        [a]: { owner: 'player-0', armies: 5 },
        [b]: { owner: 'player-0', armies: 0 }, // just conquered
        [c]: { owner: 'player-1', armies: 2 },
      },
      pendingBattle: { fromId: a, toId: b },
    };
    const next = applyAction(state, { type: 'SELECT_ATTACK', fromId: a, toId: c });
    expect(next.pendingBattle).toEqual({ fromId: a, toId: b });
  });

  it('declares the winner as soon as the last territory is captured', () => {
    const s = twoPlayer();
    const territories = Object.fromEntries(
      Object.keys(s.territories).map((id) => [id, { owner: 'player-0', armies: 3 }]),
    );
    territories['alberta'] = { owner: 'player-1', armies: 1 };
    const state: GameState = { ...s, phase: 'attack', currentPlayerIndex: 0, territories, pendingBattle: { fromId: 'alaska', toId: 'alberta' } };
    // Force a capture without dice: emulate post-capture state.
    const captured: GameState = {
      ...state,
      territories: { ...territories, alberta: { owner: 'player-0', armies: 0 } },
    };
    const done = applyAction(captured, { type: 'CAPTURE_MOVE', count: 1 });
    expect(done.phase).toBe('gameover');
    expect(done.winnerId).toBe('player-0');
  });
});
