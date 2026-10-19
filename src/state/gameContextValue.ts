import { createContext, useContext } from 'react';
import type { GameAction, GameState } from '../game/types';
import type { NewGamePlayerConfig } from '../game/setup';

export interface GameContextValue {
  state: GameState | null;
  dispatch: (action: GameAction) => void;
  startGame: (configs: NewGamePlayerConfig[]) => void;
  resetGame: () => void;
}

export const GameContext = createContext<GameContextValue | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
