import type { GameState } from '../game/types';
import { TERRITORIES } from '../game/map-data';
import { TerritoryPath } from './TerritoryPath';

interface Props {
  state: GameState;
  selectedFrom: string | null;
  validTargets: string[];
  onTerritoryClick: (id: string) => void;
}

export function MapBoard({ state, selectedFrom, validTargets, onTerritoryClick }: Props) {
  const colorFor = (ownerId: string | null) => {
    if (!ownerId) return null;
    return state.players.find((p) => p.id === ownerId)?.color ?? null;
  };

  return (
    <svg viewBox="0 0 1000 600" className="map-board" role="img" aria-label="Risk world map">
      <rect x={0} y={0} width={1000} height={600} className="map-background" />
      <image
        href={`${import.meta.env.BASE_URL}world-dotmap.svg`}
        x={36}
        y={40}
        width={869}
        height={427}
        className="map-dotmap"
        aria-hidden="true"
      />
      {TERRITORIES.map((def) => (
        <TerritoryPath
          key={def.id}
          def={def}
          ownerColor={colorFor(state.territories[def.id]?.owner ?? null)}
          armies={state.territories[def.id]?.armies ?? 0}
          isSelected={selectedFrom === def.id}
          isValidTarget={validTargets.includes(def.id)}
          onClick={() => onTerritoryClick(def.id)}
        />
      ))}
    </svg>
  );
}
