import { defineConfig, loadEnv } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import mkcert from 'vite-plugin-mkcert';
import type { Plugin } from 'vite';

export default defineConfig(({ mode }) => ({
  plugins: [
    env(mode),
    tailwindcss(),
    tsconfigPaths({
      projects: ['../../tsconfig.json'],
    }),
    tanstackStart({
      tsr: {
        generatedRouteTree: 'src/routes.gen.ts',
      },
      customViteReactPlugin: true,
      target: 'netlify',
    }),
    viteReact(),
    mode === 'development' && mkcert(),
    mode === 'development' && http2(),
  ],

  optimizeDeps: {
    exclude: ['@electric-sql/pglite', 'react-resizable-panels'],
  },

  worker: {
    format: 'es',
  },

  build: {
    target: 'esnext',
  },
}));

function env(mode?: string): Plugin {
  return {
    name: 'env',
    config: () => ({
      define: {
        'process.env': loadEnv(mode!, '../../', ''),
      },
    }),
  };
}

// Temporary, less than ideal hotfix until h3 support http2
function http2(): Plugin {
  return {
    name: 'http2',
    configureServer(server) {
      server.middlewares.use((req, _, next) => {
        if (req.httpVersionMajor >= 2 && req.headers[':method']) {
          const headers = Object.fromEntries(
            Object.entries(req.headers).filter(([key]) => !key.startsWith(':')),
          );

          req.method = req.headers[':method'] as any;
          req.url = req.headers[':path'] as any;

          Object.defineProperty(req, 'headers', {
            value: headers,
            writable: true,
            configurable: true,
          });
        }

        next();
      });
    },
  };
}
