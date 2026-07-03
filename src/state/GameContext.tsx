import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { GameAction, GameState } from '../game/types';
import { applyAction } from '../game/reducer';
import { createGame, type NewGamePlayerConfig } from '../game/setup';

interface GameContextValue {
  state: GameState | null;
  dispatch: (action: GameAction) => void;
  startGame: (configs: NewGamePlayerConfig[]) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState | null>(null);

  const dispatch = useCallback((action: GameAction) => {
    setState((prev) => (prev ? applyAction(prev, action) : prev));
  }, []);

  const startGame = useCallback((configs: NewGamePlayerConfig[]) => {
    setState(createGame(configs));
  }, []);

  const resetGame = useCallback(() => {
    setState(null);
  }, []);

  const value = useMemo(() => ({ state, dispatch, startGame, resetGame }), [state, dispatch, startGame, resetGame]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
