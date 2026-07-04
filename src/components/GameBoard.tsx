import { useEffect, useRef, useState } from 'react';
import { useGame } from '../state/GameContext';
import { MapBoard } from './MapBoard';
import { Sidebar } from './Sidebar';
import { PhasePanel } from './PhasePanel';
import { DiceLog } from './DiceLog';
import { CardHand } from './CardHand';
import { HowToPlay } from './HowToPlay';
import { decideAiAction } from '../game/ai';
import { isAdjacent } from '../game/map-data';
import { isConnected } from '../game/rules';

export function GameBoard() {
  const { state, dispatch, resetGame } = useGame();
  const [selectedFrom, setSelectedFrom] = useState<string | null>(null);
  const [pendingFortify, setPendingFortify] = useState<{ fromId: string; toId: string } | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const player = state?.players[state.currentPlayerIndex] ?? null;
  const isHumanTurn = player?.type === 'human';

  useEffect(() => {
    setSelectedFrom(null);
    setPendingFortify(null);
  }, [state?.phase, state?.currentPlayerIndex]);

  useEffect(() => {
    if (!state || state.phase === 'gameover') return;
    if (player?.type !== 'ai') return;

    timeoutRef.current = window.setTimeout(() => {
      const action = decideAiAction(state);
      if (action) dispatch(action);
    }, 400);

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [state, player, dispatch]);

  if (!state || !player) return null;

  const handleTerritoryClick = (id: string) => {
    if (!isHumanTurn) return;
    const territory = state.territories[id];

    if (state.phase === 'setup-placement') {
      if (territory.owner === player.id) {
        dispatch({ type: 'PLACE_ARMY', territoryId: id, playerId: player.id });
      }
      return;
    }

    if (state.phase === 'reinforce') {
      if (territory.owner === player.id && state.reinforcementsRemaining > 0 && player.cards.length < 5) {
        dispatch({ type: 'REINFORCE', territoryId: id, count: 1 });
      }
      return;
    }

    if (state.phase === 'attack') {
      if (state.pendingBattle) return;
      if (!selectedFrom) {
        if (territory.owner === player.id && territory.armies >= 2) setSelectedFrom(id);
        return;
      }
      if (id === selectedFrom) {
        setSelectedFrom(null);
        return;
      }
      if (territory.owner === player.id) {
        if (territory.armies >= 2) setSelectedFrom(id);
        return;
      }
      if (isAdjacent(selectedFrom, id)) {
        dispatch({ type: 'SELECT_ATTACK', fromId: selectedFrom, toId: id });
      }
      setSelectedFrom(null);
      return;
    }

    if (state.phase === 'fortify') {
      if (pendingFortify) return;
      if (!selectedFrom) {
        if (territory.owner === player.id && territory.armies >= 2) setSelectedFrom(id);
        return;
      }
      if (id === selectedFrom) {
        setSelectedFrom(null);
        return;
      }
      if (territory.owner === player.id && isConnected(selectedFrom, id, player.id, state.territories)) {
        setPendingFortify({ fromId: selectedFrom, toId: id });
      }
      setSelectedFrom(null);
    }
  };

  let validTargets: string[] = [];
  if (isHumanTurn && selectedFrom) {
    if (state.phase === 'attack') {
      validTargets = state.territories[selectedFrom]
        ? Object.keys(state.territories).filter(
            (id) => isAdjacent(selectedFrom, id) && state.territories[id].owner !== player.id,
          )
        : [];
    } else if (state.phase === 'fortify') {
      validTargets = Object.keys(state.territories).filter(
        (id) => id !== selectedFrom && state.territories[id].owner === player.id && isConnected(selectedFrom, id, player.id, state.territories),
      );
    }
  }

  return (
    <div className="game-screen">
      <div className="game-layout">
        <div className="map-panel">
          <MapBoard state={state} selectedFrom={selectedFrom} validTargets={validTargets} onTerritoryClick={handleTerritoryClick} />
        </div>
        <div className="side-panel">
          <Sidebar state={state} />
          <PhasePanel state={state} pendingFortify={pendingFortify} onCancelFortify={() => setPendingFortify(null)} />
          <CardHand state={state} />
          <DiceLog state={state} />
          {state.phase === 'gameover' && (
            <button className="primary" onClick={resetGame}>
              New Game
            </button>
          )}
        </div>
      </div>
      <HowToPlay />
    </div>
  );
}
