export type ContinentId =
  | 'north-america'
  | 'south-america'
  | 'europe'
  | 'africa'
  | 'asia'
  | 'australia';

export interface Continent {
  id: ContinentId;
  name: string;
  bonus: number;
  color: string;
}

export interface TerritoryDef {
  id: string;
  name: string;
  continent: ContinentId;
  adjacent: string[];
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  seed: number;
}

export type CardShape = 'infantry' | 'cavalry' | 'artillery' | 'wild';

export interface Card {
  id: string;
  territoryId: string | null;
  shape: CardShape;
}

export type PlayerType = 'human' | 'ai';

export interface Player {
  id: string;
  name: string;
  type: PlayerType;
  color: string;
  cards: Card[];
  alive: boolean;
}

export type Phase =
  | 'setup-placement'
  | 'reinforce'
  | 'attack'
  | 'fortify'
  | 'gameover';

export interface TerritoryState {
  owner: string | null;
  armies: number;
}

export interface DiceLogEntry {
  id: string;
  message: string;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  territories: Record<string, TerritoryState>;
  phase: Phase;
  reinforcementsRemaining: number;
  deck: Card[];
  discard: Card[];
  cardSetsTraded: number;
  conqueredThisTurn: boolean;
  log: DiceLogEntry[];
  winnerId: string | null;
  pendingBattle: PendingBattle | null;
  setupRemaining: Record<string, number>;
}

export interface PendingBattle {
  fromId: string;
  toId: string;
}

export type GameAction =
  | { type: 'PLACE_ARMY'; territoryId: string; playerId: string }
  | { type: 'REINFORCE'; territoryId: string; count: number }
  | { type: 'SELECT_ATTACK'; fromId: string; toId: string }
  | { type: 'ROLL_ATTACK'; attackerDice: number }
  | { type: 'CANCEL_BATTLE' }
  | { type: 'CAPTURE_MOVE'; count: number }
  | { type: 'END_ATTACK_PHASE' }
  | { type: 'FORTIFY'; fromId: string; toId: string; count: number }
  | { type: 'END_TURN' }
  | { type: 'TRADE_CARDS'; cardIds: string[] };
