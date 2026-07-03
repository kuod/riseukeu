import type { GameState } from '../game/types';

export function DiceLog({ state }: { state: GameState }) {
  return (
    <div className="dice-log">
      <h2>Log</h2>
      <ul>
        {state.log.map((entry) => (
          <li key={entry.id}>{entry.message}</li>
        ))}
      </ul>
    </div>
  );
}
