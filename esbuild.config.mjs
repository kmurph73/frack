import * as esbuild from "esbuild";
import { rm } from "node:fs/promises";
import { spawn } from "node:child_process";

const watch = process.argv.includes("--watch");

// Keep the wasm-pack glue out of the bundle so its `new URL('frack_bg.wasm',
// import.meta.url)` keeps resolving alongside the wasm. The path is relative
// from the bundle (dist/frontend/main.js) so it works under both `/` and a
// project-page prefix like `/frack/`. The dev backend serves any *.wasm and
// frack.js out of /pkg/ regardless of request path.
const externalWasmPackPlugin = {
  name: "external-wasm-pack",
  setup(build) {
    build.onResolve({ filter: /(^|\/)pkg\/frack\.js$/ }, () => ({
      path: "../../pkg/frack.js",
      external: true,
    }));
  },
};

const frontend = {
  entryPoints: ["frontend/main.ts"],
  outfile: "dist/frontend/main.js",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "esnext",
  sourcemap: true,
  plugins: [externalWasmPackPlugin],
  define: { __HAS_BACKEND__: "true" },
  logLevel: "info",
};

const backend = {
  entryPoints: ["backend/index.ts"],
  outfile: "dist/backend/index.js",
  bundle: true,
  format: "esm",
  platform: "node",
  target: "esnext",
  sourcemap: true,
  packages: "external",
  logLevel: "info",
};

await rm("dist", { recursive: true, force: true });

if (watch) {
  const ctxs = await Promise.all([
    esbuild.context(frontend),
    esbuild.context(backend),
  ]);
  await Promise.all(ctxs.map((c) => c.rebuild()));
  await Promise.all(ctxs.map((c) => c.watch()));
  console.log("[esbuild] watching...");

  spawn("node", ["--watch", "./dist/backend/index.js", "localhost", "8080"], {
    stdio: "inherit",
  });
} else {
  await Promise.all([esbuild.build(frontend), esbuild.build(backend)]);
}
