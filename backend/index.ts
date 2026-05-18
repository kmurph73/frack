import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { WebSocketServer } from "ws";
import { spawn } from "node:child_process";

const cwd = process.cwd();

const contentTypes: Record<string, string> = {
  ".html": "text/html; charset=UTF-8",
  ".js": "application/javascript",
  ".map": "application/json",
  ".wasm": "application/wasm",
  ".ts": "text/plain; charset=UTF-8",
  ".css": "text/css",
  ".png": "image/png",
};

function resolveAsset(reqUrl: string): string | null {
  if (reqUrl === "/") return path.join(cwd, "index.html");
  if (reqUrl.endsWith("frack.js")) return path.join(cwd, "pkg/frack.js");
  if (reqUrl.endsWith(".wasm")) {
    return path.join(cwd, "pkg", path.basename(reqUrl));
  }

  const resolved = path.resolve(cwd, "." + reqUrl);
  if (!resolved.startsWith(cwd + path.sep) && resolved !== cwd) {
    return null;
  }
  return resolved;
}

const server = http.createServer(async (req, res) => {
  if (req.url == null) {
    res.statusCode = 400;
    res.end();
    return;
  }

  const filePath = resolveAsset(req.url);
  if (filePath == null) {
    res.statusCode = 403;
    res.end();
    return;
  }

  try {
    const ext = path.extname(filePath);
    const type = contentTypes[ext] ?? "text/plain; charset=UTF-8";
    const body = await readFile(filePath);
    res.setHeader("Content-Type", type);
    res.end(body);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      res.statusCode = 404;
      res.end();
      return;
    }
    console.error(err);
    res.statusCode = 500;
    res.end();
  }
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("connected");
  const stockfish = spawn("/Users/kmurph/code/Stockfish/src/stockfish");

  stockfish.stdout.on("data", (data) => {
    ws.send(JSON.stringify({ msg: data.toString() }));
  });

  stockfish.stderr.on("data", (data) => {
    console.log(data.toString());
  });

  ws.send(JSON.stringify({ msg: "stockfish connected" }));

  ws.onmessage = (event) => {
    let json: {
      fen?: string;
      skill?: number;
      depth?: number;
      automove?: boolean;
    };
    try {
      json = JSON.parse(event.data as string);
    } catch {
      return;
    }

    if (!json.fen) return;

    let cmd = "";
    if (json.skill) {
      cmd += `setoption name Skill Level value ${json.skill}\n`;
    }
    cmd += `position fen ${json.fen}\n`;
    cmd += json.depth ? `go depth ${json.depth}\n` : `go movetime 3000\n`;

    stockfish.stdin.write(cmd);
  };

  ws.on("close", () => {
    stockfish.kill();
  });
});

server.listen(8080, () => {
  console.log("Listening on http://localhost:8080");
});
