import type { TerritoryDef } from './types';

// Positions are hand-placed on a 1000x600 viewBox to loosely resemble the
// classic Risk board layout. Each territory renders as a hexagon (see
// hexPoints in mapGeometry.ts) rather than a traced coastline.
export const TERRITORIES: TerritoryDef[] = [
  // North America
  { id: 'alaska', name: 'Alaska', continent: 'north-america', adjacent: ['northwest-territory', 'alberta', 'kamchatka'], cx: 70, cy: 60, rx: 34, ry: 28, seed: 1 },
  { id: 'northwest-territory', name: 'Northwest Territory', continent: 'north-america', adjacent: ['alaska', 'alberta', 'ontario', 'greenland'], cx: 165, cy: 55, rx: 36, ry: 28, seed: 2 },
  { id: 'greenland', name: 'Greenland', continent: 'north-america', adjacent: ['northwest-territory', 'ontario', 'quebec', 'iceland'], cx: 305, cy: 40, rx: 38, ry: 30, seed: 3 },
  { id: 'alberta', name: 'Alberta', continent: 'north-america', adjacent: ['alaska', 'northwest-territory', 'ontario', 'western-united-states'], cx: 110, cy: 130, rx: 34, ry: 28, seed: 4 },
  { id: 'ontario', name: 'Ontario', continent: 'north-america', adjacent: ['alberta', 'northwest-territory', 'greenland', 'quebec', 'western-united-states', 'eastern-united-states'], cx: 195, cy: 125, rx: 34, ry: 28, seed: 5 },
  { id: 'quebec', name: 'Quebec', continent: 'north-america', adjacent: ['ontario', 'greenland', 'eastern-united-states'], cx: 275, cy: 120, rx: 32, ry: 26, seed: 6 },
  { id: 'western-united-states', name: 'Western United States', continent: 'north-america', adjacent: ['alberta', 'ontario', 'eastern-united-states', 'central-america'], cx: 115, cy: 200, rx: 36, ry: 28, seed: 7 },
  { id: 'eastern-united-states', name: 'Eastern United States', continent: 'north-america', adjacent: ['western-united-states', 'ontario', 'quebec', 'central-america'], cx: 205, cy: 195, rx: 34, ry: 28, seed: 8 },
  { id: 'central-america', name: 'Central America', continent: 'north-america', adjacent: ['western-united-states', 'eastern-united-states', 'venezuela'], cx: 150, cy: 260, rx: 30, ry: 24, seed: 9 },

  // South America
  { id: 'venezuela', name: 'Venezuela', continent: 'south-america', adjacent: ['central-america', 'peru', 'brazil'], cx: 230, cy: 320, rx: 30, ry: 24, seed: 10 },
  { id: 'peru', name: 'Peru', continent: 'south-america', adjacent: ['venezuela', 'brazil', 'argentina'], cx: 215, cy: 395, rx: 30, ry: 26, seed: 11 },
  { id: 'brazil', name: 'Brazil', continent: 'south-america', adjacent: ['venezuela', 'peru', 'argentina', 'north-africa'], cx: 280, cy: 385, rx: 36, ry: 30, seed: 12 },
  { id: 'argentina', name: 'Argentina', continent: 'south-america', adjacent: ['peru', 'brazil'], cx: 240, cy: 470, rx: 32, ry: 28, seed: 13 },

  // Europe
  { id: 'iceland', name: 'Iceland', continent: 'europe', adjacent: ['greenland', 'great-britain', 'scandinavia'], cx: 425, cy: 60, rx: 26, ry: 22, seed: 14 },
  { id: 'great-britain', name: 'Great Britain', continent: 'europe', adjacent: ['iceland', 'scandinavia', 'northern-europe', 'western-europe'], cx: 415, cy: 125, rx: 26, ry: 22, seed: 15 },
  { id: 'scandinavia', name: 'Scandinavia', continent: 'europe', adjacent: ['iceland', 'great-britain', 'northern-europe', 'ukraine'], cx: 495, cy: 55, rx: 28, ry: 24, seed: 16 },
  { id: 'northern-europe', name: 'Northern Europe', continent: 'europe', adjacent: ['great-britain', 'scandinavia', 'ukraine', 'southern-europe', 'western-europe'], cx: 480, cy: 130, rx: 28, ry: 24, seed: 17 },
  { id: 'western-europe', name: 'Western Europe', continent: 'europe', adjacent: ['great-britain', 'northern-europe', 'southern-europe', 'north-africa'], cx: 435, cy: 195, rx: 28, ry: 24, seed: 18 },
  { id: 'southern-europe', name: 'Southern Europe', continent: 'europe', adjacent: ['northern-europe', 'western-europe', 'ukraine', 'egypt', 'north-africa', 'middle-east'], cx: 505, cy: 195, rx: 28, ry: 24, seed: 19 },
  { id: 'ukraine', name: 'Ukraine', continent: 'europe', adjacent: ['scandinavia', 'northern-europe', 'southern-europe', 'ural', 'afghanistan', 'middle-east'], cx: 570, cy: 100, rx: 32, ry: 26, seed: 20 },

  // Africa
  { id: 'north-africa', name: 'North Africa', continent: 'africa', adjacent: ['brazil', 'western-europe', 'southern-europe', 'egypt', 'east-africa', 'congo'], cx: 445, cy: 265, rx: 38, ry: 30, seed: 21 },
  { id: 'egypt', name: 'Egypt', continent: 'africa', adjacent: ['southern-europe', 'north-africa', 'east-africa', 'middle-east'], cx: 520, cy: 260, rx: 26, ry: 22, seed: 22 },
  { id: 'east-africa', name: 'East Africa', continent: 'africa', adjacent: ['egypt', 'north-africa', 'congo', 'south-africa', 'madagascar', 'middle-east'], cx: 545, cy: 335, rx: 32, ry: 28, seed: 23 },
  { id: 'congo', name: 'Congo', continent: 'africa', adjacent: ['north-africa', 'east-africa', 'south-africa'], cx: 480, cy: 345, rx: 28, ry: 24, seed: 24 },
  { id: 'south-africa', name: 'South Africa', continent: 'africa', adjacent: ['congo', 'east-africa', 'madagascar'], cx: 490, cy: 425, rx: 30, ry: 26, seed: 25 },
  { id: 'madagascar', name: 'Madagascar', continent: 'africa', adjacent: ['east-africa', 'south-africa'], cx: 565, cy: 420, rx: 24, ry: 20, seed: 26 },

  // Asia
  { id: 'ural', name: 'Ural', continent: 'asia', adjacent: ['ukraine', 'siberia', 'china', 'afghanistan'], cx: 615, cy: 100, rx: 28, ry: 24, seed: 27 },
  { id: 'siberia', name: 'Siberia', continent: 'asia', adjacent: ['ural', 'yakutsk', 'irkutsk', 'mongolia', 'china'], cx: 675, cy: 65, rx: 30, ry: 26, seed: 28 },
  { id: 'yakutsk', name: 'Yakutsk', continent: 'asia', adjacent: ['siberia', 'kamchatka', 'irkutsk'], cx: 745, cy: 45, rx: 28, ry: 24, seed: 29 },
  { id: 'kamchatka', name: 'Kamchatka', continent: 'asia', adjacent: ['yakutsk', 'irkutsk', 'mongolia', 'japan', 'alaska'], cx: 835, cy: 60, rx: 32, ry: 28, seed: 30 },
  { id: 'irkutsk', name: 'Irkutsk', continent: 'asia', adjacent: ['siberia', 'yakutsk', 'kamchatka', 'mongolia'], cx: 745, cy: 110, rx: 26, ry: 22, seed: 31 },
  { id: 'mongolia', name: 'Mongolia', continent: 'asia', adjacent: ['siberia', 'irkutsk', 'kamchatka', 'japan', 'china'], cx: 750, cy: 165, rx: 28, ry: 24, seed: 32 },
  { id: 'japan', name: 'Japan', continent: 'asia', adjacent: ['kamchatka', 'mongolia'], cx: 865, cy: 155, rx: 24, ry: 20, seed: 33 },
  { id: 'china', name: 'China', continent: 'asia', adjacent: ['ural', 'siberia', 'mongolia', 'afghanistan', 'india', 'siam'], cx: 700, cy: 205, rx: 36, ry: 28, seed: 34 },
  { id: 'afghanistan', name: 'Afghanistan', continent: 'asia', adjacent: ['ukraine', 'ural', 'china', 'india', 'middle-east'], cx: 615, cy: 175, rx: 28, ry: 24, seed: 35 },
  { id: 'middle-east', name: 'Middle East', continent: 'asia', adjacent: ['southern-europe', 'ukraine', 'afghanistan', 'india', 'egypt', 'east-africa'], cx: 600, cy: 235, rx: 30, ry: 26, seed: 36 },
  { id: 'india', name: 'India', continent: 'asia', adjacent: ['afghanistan', 'china', 'siam', 'middle-east'], cx: 675, cy: 255, rx: 30, ry: 26, seed: 37 },
  { id: 'siam', name: 'Siam', continent: 'asia', adjacent: ['india', 'china', 'indonesia'], cx: 735, cy: 265, rx: 26, ry: 22, seed: 38 },

  // Australia
  { id: 'indonesia', name: 'Indonesia', continent: 'australia', adjacent: ['siam', 'new-guinea', 'western-australia'], cx: 765, cy: 320, rx: 28, ry: 22, seed: 39 },
  { id: 'new-guinea', name: 'New Guinea', continent: 'australia', adjacent: ['indonesia', 'western-australia', 'eastern-australia'], cx: 855, cy: 320, rx: 28, ry: 22, seed: 40 },
  { id: 'western-australia', name: 'Western Australia', continent: 'australia', adjacent: ['indonesia', 'new-guinea', 'eastern-australia'], cx: 800, cy: 400, rx: 34, ry: 28, seed: 41 },
  { id: 'eastern-australia', name: 'Eastern Australia', continent: 'australia', adjacent: ['new-guinea', 'western-australia'], cx: 875, cy: 420, rx: 30, ry: 26, seed: 42 },
];

export const TERRITORY_MAP: Record<string, TerritoryDef> = Object.fromEntries(
  TERRITORIES.map((t) => [t.id, t]),
);

export function isAdjacent(aId: string, bId: string): boolean {
  return TERRITORY_MAP[aId]?.adjacent.includes(bId) ?? false;
}
