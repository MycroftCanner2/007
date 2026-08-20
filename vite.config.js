import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function serveBuildDirPlugin() {
  const handleBuildReq = (req, res, next) => {
    const rawUrl = req.url || '';
    const reqPath = rawUrl.split('?')[0];
    if (reqPath.startsWith('/build/')) {
      const filePath = path.resolve(__dirname, '.' + reqPath);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.setHeader('Content-Type', 'application/octet-stream');
        return fs.createReadStream(filePath).pipe(res);
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'ROM artifact not found on local build path' }));
        return;
      }
    }
    next();
  };

  return {
    name: 'serve-build-dir-plugin',
    configureServer(server) {
      server.middlewares.use(handleBuildReq);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleBuildReq);
    }
  };
}

export default defineConfig({
  root: 'web',
  publicDir: '../public',
  plugins: [react(), serveBuildDirPlugin()],
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },
  preview: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
});
