import { rollup } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import virtual from '@rollup/plugin-virtual';
import { db_resolver } from './db-resolver';

export async function bundle(db: any, code: string): Promise<string> {
  const bundle = await rollup({
    input: 'entry',

    plugins: [
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),

      db_resolver(db),

      virtual({
        entry: `
          import { mount } from 'svelte';
          import Component from 'component';
          mount(Component, { target: document.querySelector('#app') });
        `,
        'component': code,
      })
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
