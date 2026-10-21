import http from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("frontend");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
};
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const name = decodeURIComponent(url.pathname);
    const file = resolve(root, "." + (name === "/" ? "/index.html" : name));
    if (
      !file.startsWith(root + sep) ||
      name.split("/").some((x) => x.startsWith("."))
    ) {
      res.writeHead(403).end();
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(body);
  } catch {
    res.writeHead(404).end("Não encontrado");
  }
});
server.listen(Number(process.env.WEB_PORT || 8080), "127.0.0.1", () =>
  console.log("Frontend: http://localhost:" + (process.env.WEB_PORT || 8080)),
);
