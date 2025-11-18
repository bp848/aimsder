const http = require('http');
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const entryPoint = path.join(distDir, 'index.html');
const port = Number(process.env.PORT) || 8080;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8',
};

const sendFile = (res, filePath) => {
  const ext = path.extname(filePath);
  const mimeType = mimeTypes[ext] || 'application/octet-stream';
  const cacheHeader = /\.[a-f0-9]{6,}\./.test(path.basename(filePath))
    ? 'public,max-age=31536000,immutable'
    : 'no-cache';

  res.writeHead(200, {
    'Content-Type': mimeType,
    'Cache-Control': cacheHeader,
  });

  fs.createReadStream(filePath).pipe(res).on('error', () => {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    }
    res.end('Server error');
  });
};

const serveFallback = res => {
  fs.access(entryPoint, fs.constants.R_OK, err => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Application bundle is missing.');
      return;
    }
    sendFile(res, entryPoint);
  });
};

const safeJoin = (base, requestPath) => {
  const targetPath = path.resolve(base, requestPath);
  const relative = path.relative(base, targetPath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return null;
  }
  return targetPath;
};

const server = http.createServer((req, res) => {
  if (!req.url) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad request');
    return;
  }

  const urlPath = decodeURIComponent(req.url.split('?')[0]);

  if (['/healthz', '/readyz'].includes(urlPath)) {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('ok');
    return;
  }

  const normalizedPath = urlPath.endsWith('/') ? `${urlPath}index.html` : urlPath || '/';
  const relativePath = normalizedPath.replace(/^\/+/, '') || 'index.html';
  const absolutePath = safeJoin(distDir, relativePath);

  if (!absolutePath) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Invalid path');
    return;
  }

  fs.stat(absolutePath, (err, stats) => {
    if (!err && stats.isFile()) {
      sendFile(res, absolutePath);
      return;
    }

    if (!err && stats.isDirectory()) {
      const nestedIndex = path.join(absolutePath, 'index.html');
      fs.stat(nestedIndex, (indexErr, indexStats) => {
        if (!indexErr && indexStats.isFile()) {
          sendFile(res, nestedIndex);
          return;
        }
        serveFallback(res);
      });
      return;
    }

    serveFallback(res);
  });
});

server.listen(port, () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});
