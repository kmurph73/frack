# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — esbuild in watch mode for both frontend and backend, then spawns the dev server on `localhost:8080` under `node --watch`.
- `npm run build` — one-shot esbuild bundle of both targets into `dist/`. Clears `dist/` first.
- `npm run serve` — runs the prebuilt backend (no rebuild, no watcher). Use when you just want to run what's already in `dist/`.
- `npm run typecheck` — `tsc --noEmit`. esbuild only strips types, so this is the only thing that actually type-checks.
- `npm run wab` — `wasm-pack build --target web`. Regenerates `pkg/` from the Rust source. Re-run whenever `src/` changes.
- `./compfish.sh` — rebuilds Stockfish from `/Users/kmurph/code/Stockfish/src` (machine-local path, see "External dependencies").

There are no tests.

## Architecture

Three build outputs cooperate at runtime:

1. **Rust engine → WASM** (`src/` → `pkg/`, via wasm-pack). The "glowfish" engine. `src/lib.rs` exposes two `#[wasm_bindgen]` entry points: `get_rng()` returns a u64, `get_move(seed, fen)` returns `"from,to"` or an eval score. The engine lives in `src/engine/` (alpha-beta search with a PST/mobility eval and an opening book in `src/book.rs`). `src/rng.rs` is a PCG-128 variant — note that `get_rng()` has a hardcoded seed so it returns a constant; real randomness is injected from JS via `Math.random` in `frontend/lib/randomBigInt.ts`.

2. **TypeScript frontend** (`frontend/` → `dist/frontend/main.js`). Single esbuild bundle that includes `chess.js` (board state, move legality) but leaves `pkg/frack.js` external so its `import.meta.url`-based wasm loader keeps resolving the sibling `frack_bg.wasm` from `/pkg/`. The plugin that does this lives in `esbuild.config.mjs`. Rendering is canvas-based (`drawBoard.ts`, `drawPieces.ts`); shared mutable state lives in `frontend/globals.ts` as `state` and `globals` singletons.

3. **TypeScript backend** (`backend/index.ts` → `dist/backend/index.js`). Tiny Node `http.createServer` that serves static assets via regex-dispatch on `req.url`, plus a `WebSocketServer` that spawns a Stockfish child process per connection and pipes UCI commands in/out. Bundled with `packages: external` so `ws` and `node:*` load at runtime.

### Opponent dispatch

`state.opponent` is either `"gf"` (glowfish/WASM) or `"sf1"`..`"sf8"` (stockfish difficulty). `frontend/attemptComputerMove.ts` is the single dispatch point: `^sf` → `goFish()` (sends FEN + skill/depth over the WebSocket); otherwise → `get_move()` on the wasm. The Stockfish skill table is in `frontend/globals.ts` as `skillLevels`. The select element in `index.html` must use values that match these keys.

### Server path conventions

`backend/index.ts` rewrites a few paths and is order-sensitive:

- `/` → `index.html`
- anything matching `/frack\.js$/` → served from `cwd + "/pkg/frack.js"` (so the bundled `import "/pkg/frack.js"` resolves).
- `*.wasm` → served from `cwd + "/pkg/" + basename`, regardless of the requested directory. This is why marking `pkg/frack.js` external in esbuild keeps the wasm loader working (`import.meta.url` resolves inside `/pkg/`).
- All other extensions (`.js`, `.map`, `.ts`, `.css`, `.png`) → served from `cwd + req.url`.
- Missing files → 404 (the handler is wrapped in try/catch on `ENOENT`).

If you add a new asset type or extension, add a branch here.

## External dependencies

- **Stockfish binary**: `backend/index.ts` spawns `/Users/kmurph/code/Stockfish/src/stockfish` per WebSocket connection. This path is hardcoded. If Stockfish isn't built or the path differs, the `sf*` opponents fail silently (connection opens, no engine output). `./compfish.sh` rebuilds it for Apple Silicon.
- **`pkg/` is a build product** but is committed. After editing Rust, run `npm run wab` and commit the regenerated files.
