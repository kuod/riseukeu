import { useState } from 'react';
import type { GameState } from '../game/types';
import { isValidSet } from '../game/cards';
import { useGame } from '../state/GameContext';

export function CardHand({ state }: { state: GameState }) {
  const { dispatch } = useGame();
  const [selected, setSelected] = useState<string[]>([]);
  const player = state.players[state.currentPlayerIndex];

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const selectedCards = player.cards.filter((c) => selected.includes(c.id));
  const canTrade = state.phase === 'reinforce' && selectedCards.length === 3 && isValidSet(selectedCards);

  const trade = () => {
    dispatch({ type: 'TRADE_CARDS', cardIds: selected });
    setSelected([]);
  };

  if (player.type !== 'human') {
    return (
      <div className="card-hand">
        <h2>Cards</h2>
        <p className="hint">{player.name} holds {player.cards.length} card(s).</p>
      </div>
    );
  }

  return (
    <div className="card-hand">
      <h2>Your Cards</h2>
      <div className="card-list">
        {player.cards.length === 0 && <p className="hint">No cards yet.</p>}
        {player.cards.map((c) => (
          <button
            key={c.id}
            className={`card-chip ${c.shape} ${selected.includes(c.id) ? 'selected' : ''}`}
            onClick={() => toggle(c.id)}
          >
            {c.shape}
          </button>
        ))}
      </div>
      <button className="primary" disabled={!canTrade} onClick={trade}>
        Trade Set for Armies
      </button>
    </div>
  );
}
