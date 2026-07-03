import type { Card, CardShape } from './types';
import { TERRITORIES } from './map-data';

const SHAPES: CardShape[] = ['infantry', 'cavalry', 'artillery'];

export function buildDeck(): Card[] {
  const cards: Card[] = TERRITORIES.map((t, i) => ({
    id: `card-${t.id}`,
    territoryId: t.id,
    shape: SHAPES[i % SHAPES.length],
  }));
  cards.push({ id: 'card-wild-1', territoryId: null, shape: 'wild' });
  cards.push({ id: 'card-wild-2', territoryId: null, shape: 'wild' });
  return shuffle(cards);
}

export function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Classic Risk trade-in bonus progression.
const TRADE_IN_BONUSES = [4, 6, 8, 10, 12, 15];

export function bonusForTradeIn(tradeInIndex: number): number {
  if (tradeInIndex < TRADE_IN_BONUSES.length) return TRADE_IN_BONUSES[tradeInIndex];
  return TRADE_IN_BONUSES[TRADE_IN_BONUSES.length - 1] + (tradeInIndex - TRADE_IN_BONUSES.length + 1) * 5;
}

export function isValidSet(cards: Card[]): boolean {
  if (cards.length !== 3) return false;
  const shapes = cards.map((c) => c.shape);
  const wilds = shapes.filter((s) => s === 'wild').length;
  const nonWild = shapes.filter((s) => s !== 'wild');
  const distinctNonWild = new Set(nonWild);

  if (wilds >= 1) {
    // Wild + any two of the same shape, or wild + two different (still valid as
    // wild can represent the missing third), or two wilds + anything.
    if (wilds === 2) return true;
    // one wild + two others: valid if the two others are same shape, OR are
    // two different shapes (wild fills the third distinct shape).
    return true;
  }
  // No wilds: valid if all three same shape, or all three different shapes.
  return distinctNonWild.size === 1 || distinctNonWild.size === 3;
}

export function findAnyValidSet(cards: Card[]): Card[] | null {
  if (cards.length < 3) return null;
  const combos = combinations(cards, 3);
  for (const combo of combos) {
    if (isValidSet(combo)) return combo;
  }
  return null;
}

function combinations<T>(arr: T[], k: number): T[][] {
  const results: T[][] = [];
  const combo: T[] = [];
  function go(start: number) {
    if (combo.length === k) {
      results.push([...combo]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      go(i + 1);
      combo.pop();
    }
  }
  go(0);
  return results;
}
