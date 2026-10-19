import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { GameAction, GameState } from '../game/types';
import { GameContext } from './gameContextValue';
import { applyAction } from '../game/reducer';
import { createGame, type NewGamePlayerConfig } from '../game/setup';

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
