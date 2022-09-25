import http from "node:http";
import { readFile } from "node:fs/promises";
import { WebSocketServer } from "ws";
import cp from "node:child_process";
import { EOL } from "node:os";

// // let cnt = 1;
// proc.stdout.on("data", function (data) {
//   process.stdout.write(data);
// });
// proc.stderr.on("data", function (data) {
//   process.stderr.write(data);
// });
// proc.on("close", function (code, signal) {
//   console.log("tf");
// });

// proc.stdin.write(cmd, (err) => {
//   console.log(err);
// });

//create a server object:
const cwd = process.cwd();
const server = http.createServer(async function (req, res) {
  if (req.url === "/ws") {
    console.log("ws");
    return;
  }

  if (req.url == null) {
    res.write("tf bruv"); //write a response to the client
    res.end(); //end the response
    return;
  }

  if (req.url === "/") {
    const txt = await readFile("index.html", "utf-8");
    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    res.write(txt);
    res.end();
  } else if (/frack\.js$/.test(req.url)) {
    const js = await readFile(cwd + "/pkg/frack.js", "utf-8");
    res.setHeader("Content-Type", "application/javascript");
    res.write(js);
    res.end();
  } else if (/\.js$/.test(req.url)) {
    const js = await readFile(cwd + req.url, "utf-8");
    res.setHeader("Content-Type", "application/javascript");
    res.write(js);
    res.end();
  } else if (/\.map$/.test(req.url)) {
    const json = await readFile(cwd + req.url, "utf-8");
    res.setHeader("Content-Type", "application/json");
    res.write(json);
    res.end();
  } else if (/\.wasm$/.test(req.url)) {
    const filename = req.url.split("/").at(-1);
    const wasm = await readFile(cwd + "/pkg/" + filename);
    res.setHeader("Content-Type", "application/wasm");
    res.write(wasm);
    res.end();
  } else if (/\.ts$/.test(req.url)) {
    const ts = await readFile(cwd + req.url, "utf-8");
    // res.setHeader("Content-Type", "application/json");
    res.write(ts);
    res.end();
  } else if (/\.css$/.test(req.url)) {
    const css = await readFile(cwd + req.url, "utf-8");
    res.setHeader("Content-Type", "text/css");
    res.write(css);
    res.end();
  } else if (/\.png$/.test(req.url)) {
    const png = await readFile(cwd + req.url);
    res.setHeader("Content-Type", "image/png");
    res.write(png);
    res.end();
  } else {
    const txt = await readFile(cwd + req.url, "utf-8");
    res.setHeader("Content-Type", "text/plain; charset=UTF-8");
    res.write(txt);
    res.end();
  }
});

let spawn = cp.spawn;
let stockfish: cp.ChildProcessWithoutNullStreams | null = null;

// const cmd = `position startpos move e2e4${EOL}go movetime 3000${EOL}`;

const wss = new WebSocketServer({ server });

wss.on("connection", function (ws) {
  console.log("connected");
  stockfish = spawn("/Users/kmurph/code/Stockfish/src/stockfish");

  stockfish.stdout.on("data", function (data) {
    const msg = data.toString();
    const json = JSON.stringify({ msg });
    ws.send(json);
  });

  stockfish.stderr.on("data", (data) => {
    console.log(data);
  });

  const json = { msg: "stockfish connected" };
  ws.send(JSON.stringify(json));

  ws.onmessage = (event) => {
    const json = JSON.parse(event.data as string) as {
      fen: string | undefined;
    };

    if (json.fen) {
      const cmd = `position fen ${json.fen}${EOL}go movetime 3000${EOL}`;
      stockfish!.stdin.write(cmd);
    }
    // console.log(event.data);
  };

  ws.on("close", function () {});
});

server.listen(8080, function () {
  console.log("Listening on http://localhost:8080");
});
