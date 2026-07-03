import { useState } from 'react';
import type { PlayerType } from '../game/types';
import { useGame } from '../state/GameContext';

interface PlayerRow {
  name: string;
  type: PlayerType;
}

const DEFAULT_ROWS: PlayerRow[] = [
  { name: 'You', type: 'human' },
  { name: 'Bot 1', type: 'ai' },
  { name: 'Bot 2', type: 'ai' },
];

export function SetupScreen() {
  const { startGame } = useGame();
  const [rows, setRows] = useState<PlayerRow[]>(DEFAULT_ROWS);

  const updateRow = (i: number, patch: Partial<PlayerRow>) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  };

  const addRow = () => {
    if (rows.length >= 6) return;
    setRows((prev) => [...prev, { name: `Bot ${prev.length}`, type: 'ai' }]);
  };

  const removeRow = (i: number) => {
    if (rows.length <= 2) return;
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className="setup-screen">
      <h1>리스크 <span className="title-sub">Riseukeu</span></h1>
      <p className="setup-subtitle">Set up 2-6 players, then place your armies and conquer the world.</p>

      <div className="player-rows">
        {rows.map((row, i) => (
          <div className="player-row" key={i}>
            <input
              className="player-name-input"
              value={row.name}
              onChange={(e) => updateRow(i, { name: e.target.value })}
              maxLength={16}
            />
            <select value={row.type} onChange={(e) => updateRow(i, { type: e.target.value as PlayerType })}>
              <option value="human">Human</option>
              <option value="ai">AI</option>
            </select>
            <button className="remove-row" onClick={() => removeRow(i)} disabled={rows.length <= 2}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="setup-actions">
        <button onClick={addRow} disabled={rows.length >= 6}>
          + Add Player
        </button>
        <button className="primary" onClick={() => startGame(rows)}>
          Start Game
        </button>
      </div>
    </div>
  );
}
