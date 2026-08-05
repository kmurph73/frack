# frack

A browser chess app that plays against either a Rust/WASM engine ("glowfish") or a real Stockfish process running on the backend.

https://kmurph73.github.io/frack/

## Stack

- **Rust → WASM** (`src/` → `pkg/`): the glowfish engine — alpha-beta search with a PST/mobility eval and a small opening book.
- **TypeScript frontend** (`frontend/` → `dist/frontend/`): canvas board, [`chess.js`](https://github.com/jhlywa/chess.js) for move legality.
- **TypeScript backend** (`backend/` → `dist/backend/`): tiny Node `http` server plus a `WebSocketServer` that spawns a Stockfish child process per connection and pipes UCI back and forth.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | esbuild watch + dev server on `localhost:8080` |
| `npm run build` | one-shot bundle into `dist/` |
| `npm run serve` | run the prebuilt backend without rebuilding |
| `npm run typecheck` | `tsc --noEmit` (esbuild only strips types) |
| `npm run wab` | `wasm-pack build --target web` — regenerate `pkg/` from Rust |
| `./compfish.sh` | rebuild the local Stockfish binary |

## Opponent selection

`state.opponent` is `"gf"` (glowfish/WASM) or `"sf1"`..`"sf8"` (Stockfish difficulty). Dispatch happens in `frontend/attemptComputerMove.ts`; the skill-level table lives in `frontend/globals.ts`.

## Exporting game state for repro

`window.App.export()` returns a JSON snapshot (PGN, playerColor, flipped, opponent, autoplay, moves, rng seed). `window.App.import(json)` restores it, overwrites localStorage, and re-renders.

In prod, when the bug is on screen:

```js
copy(App.export())
```

In dev, paste it back:

```js
App.import('<paste>')
```

Because the engine reads `globals.rng` without mutating it, dev's next engine move matches prod's — that's what makes the bug reproducible.

Caveats:

- The "newgame" button reseeds `globals.rng` via `Math.random`. Don't click it after importing.
- If pasting into the console mangles quotes, wrap with backticks: `` App.import(`...`) ``.

## External dependencies

The backend spawns `/Users/kmurph/code/Stockfish/src/stockfish` per WebSocket connection — this path is hardcoded in `backend/index.ts`. If the binary isn't there, the `sf*` opponents fail silently. Run `./compfish.sh` to build it.

`pkg/` is a build product but is committed. After editing Rust, run `npm run wab` and commit the regenerated files.
