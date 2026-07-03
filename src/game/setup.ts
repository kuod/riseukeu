import type { GameState, Player, PlayerType, TerritoryState } from './types';
import { TERRITORIES } from './map-data';
import { buildDeck, shuffle } from './cards';

const STARTING_ARMIES: Record<number, number> = {
  2: 40,
  3: 35,
  4: 30,
  5: 25,
  6: 20,
};

const PLAYER_COLORS = ['#d64545', '#3b7dd8', '#3fae5c', '#e0a92e', '#8a4fd6', '#2ba9a0'];

export interface NewGamePlayerConfig {
  name: string;
  type: PlayerType;
}

export function createGame(configs: NewGamePlayerConfig[]): GameState {
  const players: Player[] = configs.map((cfg, i) => ({
    id: `player-${i}`,
    name: cfg.name,
    type: cfg.type,
    color: PLAYER_COLORS[i % PLAYER_COLORS.length],
    cards: [],
    alive: true,
  }));

  const startingArmies = STARTING_ARMIES[players.length] ?? 20;

  // Deal territories round-robin to players.
  const shuffledTerritoryIds = shuffle(TERRITORIES.map((t) => t.id));
  const territories: Record<string, TerritoryState> = {};
  shuffledTerritoryIds.forEach((id, i) => {
    const owner = players[i % players.length].id;
    territories[id] = { owner, armies: 1 };
  });

  // Each player already placed one army per owned territory (dealt above);
  // remaining armies are placed one at a time, rotating through players.
  const setupRemaining: Record<string, number> = {};
  players.forEach((p) => {
    const owned = shuffledTerritoryIds.filter((id) => territories[id].owner === p.id).length;
    setupRemaining[p.id] = startingArmies - owned;
  });

  return {
    players,
    currentPlayerIndex: 0,
    territories,
    phase: 'setup-placement',
    reinforcementsRemaining: 0,
    deck: buildDeck(),
    discard: [],
    cardSetsTraded: 0,
    conqueredThisTurn: false,
    log: [{ id: 'log-start', message: 'Game started. Territories dealt. Place your remaining armies.' }],
    winnerId: null,
    pendingBattle: null,
    setupRemaining,
  };
}
