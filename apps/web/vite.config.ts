import { defineConfig, loadEnv, type Plugin } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import ssl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    tanstackStart({
      tsr: {
        generatedRouteTree: 'src/routes.gen.ts',
        autoCodeSplitting: true,
      },
      target: 'netlify',
    }),
    tailwindcss(),
    tsconfigPaths({ projects: ['../../tsconfig.json'] }),
    env(),
    process.env.NODE_ENV === 'development' && ssl(),
    process.env.NODE_ENV === 'development' && https(),
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
});

function env(): Plugin {
  return {
    name: 'env',
    config: () => ({
      define: {
        'process.env': loadEnv(process.env.NODE_ENV!, '../../', ''),
      },
    }),
  };
}

function https(): Plugin {
  return {
    name: 'https',
    configureServer(server) {
      server.middlewares.use((req, _, next) => {
        if (req) {
          req.headers['host'] = req.headers[':authority'];
        }
        next();
      });
    },
  };
}
