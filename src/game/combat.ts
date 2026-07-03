export interface BattleResult {
  attackerRolls: number[];
  defenderRolls: number[];
  attackerLosses: number;
  defenderLosses: number;
}

function rollDice(n: number): number[] {
  const rolls: number[] = [];
  for (let i = 0; i < n; i++) rolls.push(1 + Math.floor(Math.random() * 6));
  return rolls.sort((a, b) => b - a);
}

export function resolveBattle(attackerDiceCount: number, defenderDiceCount: number): BattleResult {
  const attackerRolls = rollDice(attackerDiceCount);
  const defenderRolls = rollDice(defenderDiceCount);
  let attackerLosses = 0;
  let defenderLosses = 0;
  const comparisons = Math.min(attackerRolls.length, defenderRolls.length);
  for (let i = 0; i < comparisons; i++) {
    if (attackerRolls[i] > defenderRolls[i]) defenderLosses++;
    else attackerLosses++;
  }
  return { attackerRolls, defenderRolls, attackerLosses, defenderLosses };
}

export function maxAttackerDice(attackerArmies: number): number {
  return Math.min(3, attackerArmies - 1);
}

export function maxDefenderDice(defenderArmies: number): number {
  return Math.min(2, defenderArmies);
}
