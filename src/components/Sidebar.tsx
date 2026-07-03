import type { GameState } from '../game/types';
import { playerTerritoryCount } from '../game/rules';

export function Sidebar({ state }: { state: GameState }) {
  return (
    <div className="sidebar">
      <h2>Players</h2>
      <ul className="player-list">
        {state.players.map((p, i) => {
          const armies = Object.values(state.territories).filter((t) => t.owner === p.id).reduce((sum, t) => sum + t.armies, 0);
          return (
            <li key={p.id} className={`player-item ${i === state.currentPlayerIndex ? 'active' : ''} ${!p.alive ? 'eliminated' : ''}`}>
              <span className="color-swatch" style={{ background: p.color }} />
              <span className="player-name">{p.name}{p.type === 'ai' ? ' (AI)' : ''}</span>
              {p.alive ? (
                <span className="player-stats">
                  {playerTerritoryCount(p.id, state.territories)} territories · {armies} armies · {p.cards.length} cards
                </span>
              ) : (
                <span className="player-stats">Eliminated</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
