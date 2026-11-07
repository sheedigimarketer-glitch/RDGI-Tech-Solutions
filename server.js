/** Serves the built HerSpace application for standalone installations. */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = path.join(__dirname, 'dist');

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

const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "base-uri 'self'; object-src 'none'; frame-ancestors 'none'");

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end();
    return;
  }

  if (pathname.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store');
    const status = pathname === '/api/telephony/connect'
      ? 503
      : ['/api/auth/otp', '/api/auth/send-otp', '/api/auth/verify-otp'].includes(pathname) ? 410 : 404;
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Endpoint unavailable.' }));
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  if (pathname.includes('\\') || pathname.split('/').some(part => part.startsWith('.'))) {
    res.writeHead(404).end();
    return;
  }

  const requested = path.resolve(PUBLIC_DIR, '.' + pathname);
  if (requested !== PUBLIC_DIR && !requested.startsWith(PUBLIC_DIR + path.sep)) {
    res.writeHead(404).end();
    return;
  }

  let file = requested;
  let stat = await fs.promises.stat(file).catch(() => null);
  if (!stat?.isFile() && !path.extname(pathname) && !pathname.startsWith('/assets/')) {
    file = path.join(PUBLIC_DIR, 'index.html');
    stat = await fs.promises.stat(file).catch(() => null);
  }
  if (!stat?.isFile()) {
    res.writeHead(404).end();
    return;
  }

  res.writeHead(200, {
    'Content-Type': MIME_TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Content-Length': stat.size
  });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  fs.createReadStream(file).on('error', () => res.destroy()).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => console.log('HerSpace running on port ' + server.address().port));
if (!process.env.NO_FRESH && Number(PORT) !== 3000) {
  const freshServer = http.createServer(server.listeners('request')[0]);
  freshServer.on('error', () => {});
  freshServer.listen(3000, '0.0.0.0');
}
