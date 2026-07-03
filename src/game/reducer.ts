import type { GameAction, GameState } from './types';
import { isAdjacent } from './map-data';
import { resolveBattle, maxAttackerDice, maxDefenderDice } from './combat';
import { calculateReinforcements, isConnected, isEliminated, checkWinner } from './rules';
import { isValidSet, bonusForTradeIn, shuffle } from './cards';

let logCounter = 0;
function withLog(state: GameState, message: string): GameState {
  logCounter += 1;
  return { ...state, log: [{ id: `log-${logCounter}`, message }, ...state.log].slice(0, 50) };
}

function currentPlayer(state: GameState) {
  return state.players[state.currentPlayerIndex];
}

function nextAlivePlayerIndex(state: GameState, from: number): number {
  const n = state.players.length;
  for (let step = 1; step <= n; step++) {
    const idx = (from + step) % n;
    if (state.players[idx].alive) return idx;
  }
  return from;
}

function drawCard(state: GameState): GameState {
  let deck = state.deck;
  let discard = state.discard;
  if (deck.length === 0) {
    if (discard.length === 0) return state;
    deck = shuffle(discard);
    discard = [];
  }
  const [card, ...rest] = deck;
  const player = currentPlayer(state);
  const players = state.players.map((p) => (p.id === player.id ? { ...p, cards: [...p.cards, card] } : p));
  return { ...state, deck: rest, discard, players };
}

function beginTurn(state: GameState, playerIndex: number): GameState {
  const player = state.players[playerIndex];
  return {
    ...state,
    currentPlayerIndex: playerIndex,
    phase: 'reinforce',
    reinforcementsRemaining: calculateReinforcements(player.id, state.territories),
    conqueredThisTurn: false,
  };
}

function endTurn(state: GameState): GameState {
  const winnerId = checkWinner(state);
  if (winnerId) {
    return { ...state, phase: 'gameover', winnerId };
  }
  let next = state;
  if (state.conqueredThisTurn) {
    next = drawCard(next);
    next = withLog(next, `${currentPlayer(next).name} receives a territory card.`);
  }
  const nextIndex = nextAlivePlayerIndex(next, next.currentPlayerIndex);
  return beginTurn(next, nextIndex);
}

export function applyAction(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLACE_ARMY': {
      if (state.phase !== 'setup-placement') return state;
      const { territoryId, playerId } = action;
      const territory = state.territories[territoryId];
      if (!territory || territory.owner !== playerId) return state;
      if ((state.setupRemaining[playerId] ?? 0) <= 0) return state;

      const territories = { ...state.territories, [territoryId]: { ...territory, armies: territory.armies + 1 } };
      const setupRemaining = { ...state.setupRemaining, [playerId]: state.setupRemaining[playerId] - 1 };

      const anyRemaining = state.players.some((p) => (setupRemaining[p.id] ?? 0) > 0);
      if (!anyRemaining) {
        const started = { ...state, territories, setupRemaining };
        return withLog(beginTurn(started, 0), 'All starting armies placed. Turn 1 begins.');
      }

      let nextIndex = state.currentPlayerIndex;
      for (let step = 0; step < state.players.length; step++) {
        nextIndex = (nextIndex + 1) % state.players.length;
        if ((setupRemaining[state.players[nextIndex].id] ?? 0) > 0) break;
      }
      return { ...state, territories, setupRemaining, currentPlayerIndex: nextIndex };
    }

    case 'REINFORCE': {
      if (state.phase !== 'reinforce') return state;
      const { territoryId, count } = action;
      const player = currentPlayer(state);
      const territory = state.territories[territoryId];
      if (!territory || territory.owner !== player.id) return state;
      if (count <= 0 || count > state.reinforcementsRemaining) return state;

      const territories = { ...state.territories, [territoryId]: { ...territory, armies: territory.armies + count } };
      const reinforcementsRemaining = state.reinforcementsRemaining - count;
      const nextState = { ...state, territories, reinforcementsRemaining };
      if (reinforcementsRemaining === 0) {
        return { ...nextState, phase: 'attack' };
      }
      return nextState;
    }

    case 'TRADE_CARDS': {
      if (state.phase !== 'reinforce') return state;
      const player = currentPlayer(state);
      const cards = player.cards.filter((c) => action.cardIds.includes(c.id));
      if (cards.length !== 3 || !isValidSet(cards)) return state;

      const bonus = bonusForTradeIn(state.cardSetsTraded);
      const remainingCards = player.cards.filter((c) => !action.cardIds.includes(c.id));
      const players = state.players.map((p) => (p.id === player.id ? { ...p, cards: remainingCards } : p));
      const discard = [...state.discard, ...cards];
      return withLog(
        {
          ...state,
          players,
          discard,
          cardSetsTraded: state.cardSetsTraded + 1,
          reinforcementsRemaining: state.reinforcementsRemaining + bonus,
        },
        `${player.name} trades in a card set for ${bonus} armies.`,
      );
    }

    case 'SELECT_ATTACK': {
      if (state.phase !== 'attack') return state;
      const { fromId, toId } = action;
      const player = currentPlayer(state);
      const from = state.territories[fromId];
      const to = state.territories[toId];
      if (!from || !to) return state;
      if (from.owner !== player.id || to.owner === player.id) return state;
      if (!isAdjacent(fromId, toId)) return state;
      if (from.armies < 2) return state;
      return { ...state, pendingBattle: { fromId, toId } };
    }

    case 'ROLL_ATTACK': {
      if (state.phase !== 'attack' || !state.pendingBattle) return state;
      const { fromId, toId } = state.pendingBattle;
      const from = state.territories[fromId];
      const to = state.territories[toId];
      const attacker = currentPlayer(state);
      const defenderId = to.owner!;
      const defender = state.players.find((p) => p.id === defenderId)!;

      const attackerDice = Math.min(action.attackerDice, maxAttackerDice(from.armies));
      const defenderDice = maxDefenderDice(to.armies);
      const result = resolveBattle(attackerDice, defenderDice);

      const fromArmies = from.armies - result.attackerLosses;
      const toArmiesAfterLosses = to.armies - result.defenderLosses;

      let territories = {
        ...state.territories,
        [fromId]: { ...from, armies: fromArmies },
        [toId]: { ...to, armies: Math.max(toArmiesAfterLosses, 0) },
      };

      let next: GameState = withLog(
        { ...state, territories },
        `${attacker.name} attacks ${defender.name}: rolled [${result.attackerRolls.join(',')}] vs [${result.defenderRolls.join(',')}]. Attacker lost ${result.attackerLosses}, defender lost ${result.defenderLosses}.`,
      );

      if (toArmiesAfterLosses <= 0) {
        // Territory captured — require attacker to move armies in.
        territories = { ...territories, [toId]: { owner: attacker.id, armies: 0 } };
        next = { ...next, territories, conqueredThisTurn: true };
        next = withLog(next, `${attacker.name} conquers ${toId.replace(/-/g, ' ')}!`);

        if (isEliminated(defenderId, next.territories)) {
          const capturedCards = defender.cards;
          const players = next.players.map((p) => {
            if (p.id === defenderId) return { ...p, alive: false, cards: [] };
            if (p.id === attacker.id) return { ...p, cards: [...p.cards, ...capturedCards] };
            return p;
          });
          next = withLog({ ...next, players }, `${defender.name} has been eliminated! ${attacker.name} takes their cards.`);
        }
        return { ...next, pendingBattle: { fromId, toId } };
      }

      if (fromArmies < 2) {
        return { ...next, pendingBattle: null };
      }

      return next;
    }

    case 'CAPTURE_MOVE': {
      if (!state.pendingBattle) return state;
      const { fromId, toId } = state.pendingBattle;
      if (!state.territories[fromId] || !state.territories[toId]) return state;
      const maxMove = state.territories[fromId].armies - 1;
      const count = Math.min(Math.max(action.count, 1), maxMove);

      const territories = {
        ...state.territories,
        [fromId]: { ...state.territories[fromId], armies: state.territories[fromId].armies - count },
        [toId]: { ...state.territories[toId], armies: count },
      };
      return { ...state, territories, pendingBattle: null };
    }

    case 'CANCEL_BATTLE': {
      return { ...state, pendingBattle: null };
    }

    case 'END_ATTACK_PHASE': {
      if (state.phase !== 'attack') return state;
      return { ...state, phase: 'fortify', pendingBattle: null };
    }

    case 'FORTIFY': {
      if (state.phase !== 'fortify') return state;
      const { fromId, toId, count } = action;
      const player = currentPlayer(state);
      const from = state.territories[fromId];
      const to = state.territories[toId];
      if (!from || !to || from.owner !== player.id || to.owner !== player.id) return state;
      if (count <= 0 || count >= from.armies) return state;
      if (!isConnected(fromId, toId, player.id, state.territories)) return state;

      const territories = {
        ...state.territories,
        [fromId]: { ...from, armies: from.armies - count },
        [toId]: { ...to, armies: to.armies + count },
      };
      return endTurn({ ...state, territories });
    }

    case 'END_TURN': {
      return endTurn(state);
    }

    default:
      return state;
  }
}
