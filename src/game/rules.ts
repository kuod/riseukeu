import type { GameState } from './types';
import { TERRITORY_MAP } from './map-data';
import { CONTINENTS, continentsControlledBy } from './continents';

export function territoriesOwnedBy(playerId: string, territories: GameState['territories']): string[] {
  return Object.entries(territories)
    .filter(([, t]) => t.owner === playerId)
    .map(([id]) => id);
}

export function calculateReinforcements(playerId: string, territories: GameState['territories']): number {
  const owned = territoriesOwnedBy(playerId, territories);
  const base = Math.max(3, Math.floor(owned.length / 3));
  const continentBonus = continentsControlledBy(playerId, territories).reduce(
    (sum, c) => sum + CONTINENTS[c].bonus,
    0,
  );
  return base + continentBonus;
}

// BFS over territories owned by playerId to check fortify-move connectivity.
export function isConnected(fromId: string, toId: string, playerId: string, territories: GameState['territories']): boolean {
  if (fromId === toId) return false;
  const visited = new Set<string>([fromId]);
  const queue = [fromId];
  while (queue.length) {
    const current = queue.shift()!;
    if (current === toId) return true;
    const def = TERRITORY_MAP[current];
    for (const neighborId of def.adjacent) {
      if (visited.has(neighborId)) continue;
      if (territories[neighborId]?.owner !== playerId) continue;
      visited.add(neighborId);
      queue.push(neighborId);
    }
  }
  return visited.has(toId);
}

export function playerTerritoryCount(playerId: string, territories: GameState['territories']): number {
  return territoriesOwnedBy(playerId, territories).length;
}

export function isEliminated(playerId: string, territories: GameState['territories']): boolean {
  return playerTerritoryCount(playerId, territories) === 0;
}

export function checkWinner(state: GameState): string | null {
  const alivePlayers = state.players.filter((p) => p.alive);
  const totalTerritories = Object.keys(state.territories).length;
  for (const p of alivePlayers) {
    if (playerTerritoryCount(p.id, state.territories) === totalTerritories) return p.id;
  }
  return null;
}
