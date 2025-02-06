import { onDestroy, onMount } from 'svelte';
import * as svelte_client from 'svelte/internal/client';
import ui from '#/runtime/ui';
import ai from '#/runtime/ai';

export function make_component(code: string) {
  console.log(code);
  const res = new Function(
    '$',
    'onMount',
    'onDestroy',
    'ui',
    'ai',
    `return ${code};`,
  )(svelte_client, onMount, onDestroy, ui, ai);
  console.log(res.toString());
  return res;
}
