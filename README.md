# 리스크 · Riseukeu

**[Play it live](https://kuod.github.io/riseukeu/)**

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

Requires Node.js `^20.19.0` or `>=22.12.0` (Vite 8).

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

## Development

```bash
npm run lint   # oxlint
npm test       # vitest unit tests for game rules
npm run build  # type-check + production build
```

## Continuous integration and deployment

`.github/workflows/deploy.yml` runs on pull requests, pushes to `main`, and manual dispatch (`workflow_dispatch`). The `build` job runs, in order:

```bash
npm ci
npm run lint
npm test
npm run build
```

The `deploy` job publishes `dist/` to GitHub Pages only on a push to `main` or a manual dispatch, and only after `build` passes. Pull requests run the checks but never deploy.

Node is set up from `.nvmrc` (`22.12.0`), which falls inside the `engines` range in `package.json` (`^20.19.0 || >=22.12.0`).

## How to play

1. **Setup** — armies are dealt automatically; click your territories to place your remaining starting armies.
2. **Reinforce** — click your territories to add new armies (based on territories owned, continent bonuses, and traded-in card sets).
3. **Attack** — click one of your territories, then an adjacent enemy territory, to start a battle. Choose your dice count and roll. Capturing a territory requires moving armies in.
4. **Fortify** — optionally move armies once between two connected territories you own, then end your turn.

The game ends when one player controls all 42 territories.

## Tech stack

React + TypeScript + Vite. Game rules and AI logic live in `src/game/` as plain, framework-free TypeScript (`reducer.ts` is the core state machine); UI components in `src/components/` dispatch actions and render state.

`public/world-dotmap.svg` is a real-coastline dot-matrix backdrop (Winkel-Tripel projection, Natural Earth land data) reused from the [wc2026-bracket](https://github.com/kuod/wc2026-bracket) project's `tools/gen_dotmap.py`; it renders behind the stylized territory shapes for geographic texture.

## License

[MIT](LICENSE)
