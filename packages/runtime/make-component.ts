import { onDestroy, onMount } from 'svelte';
import * as svelte_client from 'svelte/internal/client';
import ui from './ui';
import ai from './ai';

export function make_component(code: string) {
  return new Function(
    '$',
    'onMount',
    'onDestroy',
    'ui',
    'ai',
    `return ${code};`,
  )(svelte_client, onMount, onDestroy, ui, ai);
}
