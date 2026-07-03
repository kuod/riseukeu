import type { GameAction, GameState } from './types';
import { TERRITORY_MAP } from './map-data';
import { territoriesOwnedBy, isConnected } from './rules';
import { findAnyValidSet } from './cards';
import { maxAttackerDice } from './combat';

function borderTerritories(playerId: string, state: GameState): string[] {
  const owned = territoriesOwnedBy(playerId, state.territories);
  return owned.filter((id) => TERRITORY_MAP[id].adjacent.some((adjId) => state.territories[adjId].owner !== playerId));
}

// Returns the next action the AI wants to take, or null if it has nothing to
// do (caller should then request END_ATTACK_PHASE / END_TURN as appropriate).
export function decideAiAction(state: GameState): GameAction | null {
  const player = state.players[state.currentPlayerIndex];

  if (state.phase === 'setup-placement') {
    const owned = territoriesOwnedBy(player.id, state.territories);
    const target = weakestBorder(player.id, state, owned) ?? owned[0];
    if (!target) return null;
    return { type: 'PLACE_ARMY', territoryId: target, playerId: player.id };
  }

  if (state.phase === 'reinforce') {
    const set = findAnyValidSet(player.cards);
    if (set && (player.cards.length >= 5 || set.length === 3)) {
      return { type: 'TRADE_CARDS', cardIds: set.map((c) => c.id) };
    }
    const owned = territoriesOwnedBy(player.id, state.territories);
    const target = weakestBorder(player.id, state, owned) ?? owned[0];
    if (!target) return null;
    return { type: 'REINFORCE', territoryId: target, count: state.reinforcementsRemaining };
  }

  if (state.phase === 'attack') {
    if (state.pendingBattle) {
      const { fromId, toId } = state.pendingBattle;
      const from = state.territories[fromId];
      const to = state.territories[toId];
      if (!from || !to) return { type: 'CANCEL_BATTLE' };
      if (to.armies === 0) {
        return { type: 'CAPTURE_MOVE', count: Math.max(1, from.armies - 1) };
      }
      return { type: 'ROLL_ATTACK', attackerDice: maxAttackerDice(from.armies) };
    }
    const opportunity = findAttackOpportunity(player.id, state);
    if (opportunity) return { type: 'SELECT_ATTACK', ...opportunity };
    return { type: 'END_ATTACK_PHASE' };
  }

  if (state.phase === 'fortify') {
    const move = findFortifyMove(player.id, state);
    if (move) return { type: 'FORTIFY', ...move };
    return { type: 'END_TURN' };
  }

  return null;
}

function weakestBorder(playerId: string, state: GameState, owned: string[]): string | null {
  const borders = borderTerritories(playerId, state);
  const pool = borders.length ? borders : owned;
  if (!pool.length) return null;
  return pool.reduce((weakest, id) =>
    state.territories[id].armies < state.territories[weakest].armies ? id : weakest,
  );
}

function findAttackOpportunity(playerId: string, state: GameState): { fromId: string; toId: string } | null {
  const owned = territoriesOwnedBy(playerId, state.territories);
  let best: { fromId: string; toId: string; advantage: number } | null = null;

  for (const fromId of owned) {
    const from = state.territories[fromId];
    if (from.armies < 2) continue;
    for (const toId of TERRITORY_MAP[fromId].adjacent) {
      const to = state.territories[toId];
      if (to.owner === playerId) continue;
      const advantage = from.armies - to.armies;
      if (advantage > 0 && (!best || advantage > best.advantage)) {
        best = { fromId, toId, advantage };
      }
    }
  }
  // Only attack when meaningfully favored (armies-wise) to keep AI from
  // suiciding into stalemates.
  if (best && best.advantage >= 2) return { fromId: best.fromId, toId: best.toId };
  return null;
}

function findFortifyMove(playerId: string, state: GameState): { fromId: string; toId: string; count: number } | null {
  const owned = territoriesOwnedBy(playerId, state.territories);
  const interior = owned.filter((id) => !TERRITORY_MAP[id].adjacent.some((a) => state.territories[a].owner !== playerId));
  const borders = owned.filter((id) => TERRITORY_MAP[id].adjacent.some((a) => state.territories[a].owner !== playerId));
  if (!interior.length || !borders.length) return null;

  const source = interior.reduce((max, id) => (state.territories[id].armies > state.territories[max].armies ? id : max), interior[0]);
  if (state.territories[source].armies < 2) return null;

  const target = borders.find((id) => isConnected(source, id, playerId, state.territories));
  if (!target) return null;

  return { fromId: source, toId: target, count: state.territories[source].armies - 1 };
}
