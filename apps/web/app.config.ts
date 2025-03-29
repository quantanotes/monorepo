import { loadEnv } from 'vite';
import { defineConfig } from '@tanstack/react-start/config';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

function env() {
  return {
    name: 'env',
    config: () => ({
      define: {
        'process.env': loadEnv(process.env.NODE_ENV!, '../../', ''),
      },
    }),
  };
}

export default defineConfig({
  tsr: {
    appDirectory: 'src',
    generatedRouteTree: 'src/routes.gen.ts',
  },
  server: {
    https: true,
    experimental: {
      websocket: true,
    },
  },
  vite: {
    plugins: [
      viteTsConfigPaths({
        projects: ['../../tsconfig.json'],
      }),
      tailwindcss(),
      env(),
    ],
    optimizeDeps: {
      exclude: ['@electric-sql/pglite'],
    },
    ssr: {
      noExternal: ['react-use'],
    },
    worker: {
      format: 'es',
    },
    resolve: {
      alias: {
        flowtoken: 'flowtoken/src',
      },
    },
  },
}).then((app) =>
  app.addRouter({
    name: 'agentws',
    type: 'http',
    handler: './src/routes/api.ai.agent.ts',
    target: 'server',
    base: '/api/ai/agent',
    plugins: () => [
      viteTsConfigPaths({
        projects: ['../../tsconfig.json'],
      }),
      env(),
    ],
  }),
);
