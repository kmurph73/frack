import { rm, mkdir, cp } from "node:fs/promises";
import { spawn } from "node:child_process";
import * as esbuild from "esbuild";

const out = "dist-pages";

const run = (cmd, args) =>
  new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: "inherit" });
    proc.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} exited with ${code}`));
    });
    proc.on("error", reject);
  });

const externalWasmPackPlugin = {
  name: "external-wasm-pack",
  setup(build) {
    build.onResolve({ filter: /(^|\/)pkg\/frack\.js$/ }, () => ({
      path: "../../pkg/frack.js",
      external: true,
    }));
  },
};

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

await run("wasm-pack", ["build", "--target", "web"]);

await esbuild.build({
  entryPoints: ["frontend/main.ts"],
  outfile: `${out}/dist/frontend/main.js`,
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "esnext",
  minify: true,
  plugins: [externalWasmPackPlugin],
  define: { __HAS_BACKEND__: "false" },
  logLevel: "info",
});

const staticFiles = [
  "index.html",
  "app.css",
  "util.css",
  "chesspieces.png",
  "favicon.ico",
  "pgns.txt",
];

for (const f of staticFiles) {
  await cp(f, `${out}/${f}`);
}

await mkdir(`${out}/pkg`, { recursive: true });
await cp("pkg/frack.js", `${out}/pkg/frack.js`);
await cp("pkg/frack_bg.wasm", `${out}/pkg/frack_bg.wasm`);

console.log(`built static site to ${out}/`);
