import { defineConfig, loadEnv } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import tsConfigPaths from 'vite-tsconfig-paths';

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
    tsConfigPaths({ projects: ['../../tsconfig.json'] }),
    env(),
    process.env.NODE_ENV === 'development' && basicSsl(),
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
