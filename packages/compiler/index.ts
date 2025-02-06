import * as svelte_compiler from 'svelte/compiler';
import { rollup } from 'rollup';
import virtual from '@rollup/plugin-virtual';

export async function bundle(db: any, code: string) {
  const bundle = await rollup({
    input: 'entry',
    plugins: [
      virtual({ entry: code }),
    ],

    onwarn(warning, warn) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        return;
      } else {
        warn(warning);
      }
    },
  });

  const { output } = await bundle.generate({
    format: 'iife',
    sourcemap: false,
  });

  return output[0].code;
}

export function compile(code: string) {
  const { js } = svelte_compiler.compile(code, { generate: 'client' });
  return js.code;
}
