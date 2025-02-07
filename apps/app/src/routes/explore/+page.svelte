<script>
  import { getChatContext } from '$/chat.svelte';

  let { data } = $props();

  const chat = getChatContext();
</script>

<div class="mt-[57px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {#each data.actions as action}
    <div
      class="border p-1 aspect-square p-4 hover:bg-accent transition-colors"
      onclick={() => {
        chat.append_island(action.bundled);
      }}
    >
      {action.name}
    </div>
  {/each}
</div>
