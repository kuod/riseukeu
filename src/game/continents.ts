import type { Continent, ContinentId, GameState } from './types';

export const CONTINENTS: Record<ContinentId, Continent> = {
  'north-america': { id: 'north-america', name: 'North America', bonus: 5, color: '#d98c4a' },
  'south-america': { id: 'south-america', name: 'South America', bonus: 2, color: '#c65b5b' },
  europe: { id: 'europe', name: 'Europe', bonus: 5, color: '#5b8fc6' },
  africa: { id: 'africa', name: 'Africa', bonus: 3, color: '#c6a45b' },
  asia: { id: 'asia', name: 'Asia', bonus: 7, color: '#6bb06b' },
  australia: { id: 'australia', name: 'Australia', bonus: 2, color: '#a05bc6' },
};

import { TERRITORIES } from './map-data';

const territoriesByContinent: Record<ContinentId, string[]> = (() => {
  const map = {} as Record<ContinentId, string[]>;
  for (const c of Object.keys(CONTINENTS) as ContinentId[]) map[c] = [];
  for (const t of TERRITORIES) map[t.continent].push(t.id);
  return map;
})();

export function continentControlledBy(
  continent: ContinentId,
  playerId: string,
  territories: GameState['territories'],
): boolean {
  return territoriesByContinent[continent].every((tid) => territories[tid]?.owner === playerId);
}

export function continentsControlledBy(playerId: string, territories: GameState['territories']): ContinentId[] {
  return (Object.keys(CONTINENTS) as ContinentId[]).filter((c) =>
    continentControlledBy(c, playerId, territories),
  );
}

export { territoriesByContinent };
