# 리스크 · Riseukeu

A playable clone of the board game Risk, built as a static web app. "Riseukeu" (리스크) is the Korean phonetic loanword for "risk."

Play a full game of world conquest in the browser: classic 42-territory map, six continents, dice combat, territory cards, and local hotseat play against heuristic AI bots. No backend — everything runs client-side.

## Features

- Classic Risk map (6 continents, 42 territories) rendered as an SVG board
- 2–6 players, any mix of human (pass-and-play) and AI
- Full turn structure: reinforce → attack → fortify
- Dice-based combat (up to 3 attacker dice, 2 defender dice)
- Continent control bonuses and territory cards with escalating trade-in bonuses
- Player elimination with card transfer, and win detection
- Heuristic AI opponents for solo or mixed-player games

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL and set up a game — choose 2–6 players, mark each as Human or AI, and start.

## Building for production

```bash
npm run build
```

Outputs static files to `dist/`, deployable to any static host (GitHub Pages, Netlify, Vercel, S3, etc.).

## How to play

1. **Setup** — armies are dealt automatically; click your territories to place your remaining starting armies.
2. **Reinforce** — click your territories to add new armies (based on territories owned, continent bonuses, and traded-in card sets).
3. **Attack** — click one of your territories, then an adjacent enemy territory, to start a battle. Choose your dice count and roll. Capturing a territory requires moving armies in.
4. **Fortify** — optionally move armies once between two connected territories you own, then end your turn.

The game ends when one player controls all 42 territories.

## Tech stack

React + TypeScript + Vite. Game rules and AI logic live in `src/game/` as plain, framework-free TypeScript (`reducer.ts` is the core state machine); UI components in `src/components/` dispatch actions and render state.
