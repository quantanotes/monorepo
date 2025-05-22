import { IncomingMessage } from 'http';
import { Readable } from 'stream';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig(({ mode }) => ({
  plugins: [
    tanstackStart({
      tsr: {
        generatedRouteTree: 'src/routes.gen.ts',
        enableCodeSplitting: true,
      },

      target: 'cloudflare-module',

      nitro: {
        compatibilityDate: '2025-05-21',
        //sourceMap: false,

        cloudflare: {
          nodeCompat: true,
        },

        experimental: {
          websocket: true,
        },

        // handlers: [
        //   {
        //     route: '/api/ai/agent',
        //     handler: 'src/routes/api.ai.agent',
        //   },
        // ],
        //

        rollupConfig: {
          external: ['cloudflare:sockets'],
          output: {
            format: 'es',
          },
        },
      },
    }),

    tsconfigPaths({ projects: ['../../tsconfig.json'] }),
    tailwindcss(),
    env(),

    mode === 'development' && mkcert(),
    mode === 'development' && http2(),
  ],

  optimizeDeps: {
    exclude: ['@electric-sql/pglite'],
  },

  resolve: {
    alias: {
      flowtoken: 'flowtoken/src',
    },
  },

  worker: {
    format: 'es',
  },

  build: {
    target: 'esnext',
  },
}));

function env(): Plugin {
  return {
    name: 'env',
    config: ({ mode }) => ({
      define: {
        'process.env': loadEnv(mode!, '../../', ''),
      },
    }),
  };
}

function http2(): Plugin {
  return {
    name: 'http2',
    configureServer(server) {
      server.middlewares.use((req, _, next) => {
        if (req.httpVersionMajor >= 2 && req.headers[':method']) {
          const chunks: Buffer[] = [];

          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const r = new Readable() as any;

            const headers = Object.fromEntries(
              Object.entries(req.headers).filter(
                ([key]) => !key.startsWith(':'),
              ),
            );
            headers.host = req.headers[':authority'] as string;

            r.method = req.headers[':method'];
            r.url = req.headers[':path'];
            r.headers = headers;

            r.push(buffer);
            r.push(null);

            Object.setPrototypeOf(req, IncomingMessage.prototype);
            Object.assign(req, r);

            next();
          });

          req.on('error', (err) => next(err));
        } else {
          next();
        }
      });
    },
  };
}
