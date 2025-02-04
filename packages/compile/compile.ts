import { compile as compile_svelte } from 'svelte/compiler';

export function compile(code: string) {
  const { js } = compile_svelte(code, { generate: 'client' });
  return js.code;
}
