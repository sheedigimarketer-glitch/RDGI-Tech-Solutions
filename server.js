/**
 * HerSpace Premium 4.1 - Local Development & Demonstration Server
 * Zero dependencies, built with standard Node.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(PUBLIC_DIR, reqPath);

  // Security guard against path traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      return res.end('<h1>404 Not Found</h1><p>The requested HerSpace resource was not found.</p>');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('\n======================================================');
  console.log('HERSPACE PREMIUM 4.1 LOCAL PREVIEW RUNNING');
  console.log('URL: http://localhost:' + PORT);
  console.log('======================================================\n');
});

// Optional second port so a browser tab with a stale cache on 8080 can be bypassed.
// Set NO_FRESH=1 (used by automated tests) to skip it.
if (!process.env.NO_FRESH) {
  const FRESH_PORT = 3000;
  const freshServer = http.createServer(server.listeners('request')[0]);
  freshServer.on('error', () => {});
  freshServer.listen(FRESH_PORT, '0.0.0.0', () => {
    console.log('FRESH CACHE-FREE PREVIEW URL: http://localhost:' + FRESH_PORT);
  });
}
