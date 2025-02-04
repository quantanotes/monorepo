import * as path from 'path';
import { rollup } from 'rollup';
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import virtual from '@rollup/plugin-virtual';
import { db_resolver } from './db-resolver';

export async function bundle(db: any, code: string): Promise<string> {
  const bundle = await rollup({
    input: 'entry',

    plugins: [
      alias({
        entries: {
          'ai': path.resolve(__dirname, '../runtime/ai.ts'),
        },
      }),

      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),

      typescript({
        include: [path.resolve(__dirname, '../runtime/ai.ts')],
      }),

      virtual({
        entry: `
          import { mount } from 'svelte';
          import Component from 'component';
          mount(Component, { target: document.querySelector('#app') });
        `,
        'component': code,
      }),

      db_resolver(db),
    ],
    
    onwarn(warning, warn) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        return;
      } else {
        warn(warning);
      }
    }
  });

  const { output } = await bundle.generate({
    format: 'esm',
    sourcemap: false,
  });

  return output[0].code;
}
