import { useState, useEffect } from 'react';
import type { GameState } from '../game/types';
import { useGame } from '../state/GameContext';
import { maxAttackerDice } from '../game/combat';

interface Props {
  state: GameState;
  pendingFortify: { fromId: string; toId: string } | null;
  onCancelFortify: () => void;
}

export function PhasePanel({ state, pendingFortify, onCancelFortify }: Props) {
  const { dispatch } = useGame();
  const player = state.players[state.currentPlayerIndex];
  const isHuman = player.type === 'human';
  const [attackerDice, setAttackerDice] = useState(1);
  const [captureCount, setCaptureCount] = useState(1);
  const [fortifyCount, setFortifyCount] = useState(1);

  const battle = state.pendingBattle;
  const battleFrom = battle ? state.territories[battle.fromId] : null;
  const battleTo = battle ? state.territories[battle.toId] : null;
  const captured = battle && battleTo && battleTo.armies === 0 && battleTo.owner === player.id;

  useEffect(() => {
    if (battleFrom) {
      const max = maxAttackerDice(battleFrom.armies);
      setAttackerDice((d) => Math.min(d, Math.max(1, max)));
    }
  }, [battleFrom?.armies]);

  useEffect(() => {
    if (captured && battleFrom) {
      setCaptureCount(Math.min(captureCount, Math.max(1, battleFrom.armies - 1)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captured, battleFrom?.armies]);

  useEffect(() => {
    if (pendingFortify) {
      const from = state.territories[pendingFortify.fromId];
      setFortifyCount(1);
      void from;
    }
  }, [pendingFortify, state.territories]);

  if (!isHuman) {
    return (
      <div className="phase-panel">
        <h2>Phase: {state.phase}</h2>
        <p className="hint">{player.name} (AI) is taking its turn…</p>
      </div>
    );
  }

  if (state.phase === 'gameover') {
    return (
      <div className="phase-panel">
        <h2>Game Over</h2>
        <p>{state.players.find((p) => p.id === state.winnerId)?.name} conquers the world!</p>
      </div>
    );
  }

  if (state.phase === 'setup-placement') {
    return (
      <div className="phase-panel">
        <h2>Setup</h2>
        <p className="hint">
          {player.name}: place {state.setupRemaining[player.id]} more armies. Click one of your territories on the
          map to add an army.
        </p>
      </div>
    );
  }

  if (state.phase === 'reinforce') {
    return (
      <div className="phase-panel">
        <h2>Reinforce</h2>
        <p className="hint">
          {player.cards.length >= 5
            ? 'You hold 5+ cards — trade in a set below before placing armies.'
            : state.reinforcementsRemaining > 0
              ? `Place ${state.reinforcementsRemaining} more armies. Click your territories on the map.`
              : 'All armies placed.'}
        </p>
      </div>
    );
  }

  if (state.phase === 'attack') {
    if (battle && battleFrom && battleTo) {
      if (captured) {
        const maxMove = Math.max(1, battleFrom.armies - 1);
        return (
          <div className="phase-panel">
            <h2>Territory Captured!</h2>
            <p className="hint">Move armies into the conquered territory (leave at least 1 behind).</p>
            <div className="stepper">
              <input
                type="range"
                min={1}
                max={maxMove}
                value={captureCount}
                onChange={(e) => setCaptureCount(Number(e.target.value))}
              />
              <span>{captureCount}</span>
            </div>
            <button className="primary" onClick={() => dispatch({ type: 'CAPTURE_MOVE', count: captureCount })}>
              Confirm Move
            </button>
          </div>
        );
      }
      const maxDice = Math.max(1, maxAttackerDice(battleFrom.armies));
      return (
        <div className="phase-panel">
          <h2>Battle</h2>
          <p className="hint">
            Attacking from {battleFrom.armies} armies into defender with {battleTo.armies} armies.
          </p>
          <div className="stepper">
            <input
              type="range"
              min={1}
              max={maxDice}
              value={attackerDice}
              onChange={(e) => setAttackerDice(Number(e.target.value))}
            />
            <span>{attackerDice} dice</span>
          </div>
          <div className="button-row">
            <button className="primary" onClick={() => dispatch({ type: 'ROLL_ATTACK', attackerDice })}>
              Roll Dice
            </button>
            <button onClick={() => dispatch({ type: 'CANCEL_BATTLE' })}>Retreat</button>
          </div>
        </div>
      );
    }
    return (
      <div className="phase-panel">
        <h2>Attack</h2>
        <p className="hint">Click one of your territories, then an adjacent enemy territory to attack.</p>
        <button className="primary" onClick={() => dispatch({ type: 'END_ATTACK_PHASE' })}>
          End Attack Phase
        </button>
      </div>
    );
  }

  if (state.phase === 'fortify') {
    if (pendingFortify) {
      const from = state.territories[pendingFortify.fromId];
      const maxMove = Math.max(1, from.armies - 1);
      return (
        <div className="phase-panel">
          <h2>Fortify</h2>
          <div className="stepper">
            <input
              type="range"
              min={1}
              max={maxMove}
              value={Math.min(fortifyCount, maxMove)}
              onChange={(e) => setFortifyCount(Number(e.target.value))}
            />
            <span>{Math.min(fortifyCount, maxMove)}</span>
          </div>
          <div className="button-row">
            <button
              className="primary"
              onClick={() =>
                dispatch({
                  type: 'FORTIFY',
                  fromId: pendingFortify.fromId,
                  toId: pendingFortify.toId,
                  count: Math.min(fortifyCount, maxMove),
                })
              }
            >
              Confirm Move
            </button>
            <button onClick={onCancelFortify}>Cancel</button>
          </div>
        </div>
      );
    }
    return (
      <div className="phase-panel">
        <h2>Fortify</h2>
        <p className="hint">Optionally select two connected territories you own to move armies, or end your turn.</p>
        <button className="primary" onClick={() => dispatch({ type: 'END_TURN' })}>
          End Turn
        </button>
      </div>
    );
  }

  return null;
}
