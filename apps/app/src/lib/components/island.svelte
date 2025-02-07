<script>
  import { onMount, mount } from 'svelte';
  import { make_component } from '#/runtime';

  let { code } = $props();

  let target = $state();

  onMount(() => {
    const component = make_component(code);
    mount(component, { target });
  });
</script>

<div bind:this={target}></div>
