import type { TerritoryDef } from '../game/types';
import { blobPoints } from '../game/mapGeometry';

interface Props {
  def: TerritoryDef;
  ownerColor: string | null;
  armies: number;
  isSelected: boolean;
  isValidTarget: boolean;
  onClick: () => void;
}

export function TerritoryPath({ def, ownerColor, armies, isSelected, isValidTarget, onClick }: Props) {
  const points = blobPoints(def.cx, def.cy, def.rx, def.ry, def.seed);
  return (
    <g className="territory" onClick={onClick}>
      <polygon
        points={points}
        fill={ownerColor ?? '#888'}
        stroke={isSelected ? '#fff' : isValidTarget ? '#ffd94a' : '#1a1a1a'}
        strokeWidth={isSelected || isValidTarget ? 3 : 1.2}
        className={isValidTarget ? 'territory-target' : undefined}
      />
      <text x={def.cx} y={def.cy - 2} textAnchor="middle" className="territory-name">
        {def.name}
      </text>
      <circle cx={def.cx} cy={def.cy + 12} r={11} fill="rgba(0,0,0,0.55)" />
      <text x={def.cx} y={def.cy + 16} textAnchor="middle" className="territory-armies">
        {armies}
      </text>
    </g>
  );
}
