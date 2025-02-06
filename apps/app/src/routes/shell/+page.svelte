<script>
  import Island from '$/components/island.svelte';
  import { getChatContext } from '$/chat.svelte';

  let chat = getChatContext();
</script>

<div class="flex flex-col gap-6 px-8 pb-96 pt-20">
  {#each chat.messages as message}
    {#if message.role === 'render'}
      <Island code={message.content}>I'm an island boy</Island>
    {:else}
      <div
        class={[
          message.role === 'user' ? 'border-l-6 px-3 text-4xl' : 'text-xl',
        ]}
      >
        {message.content}
      </div>
    {/if}
  {/each}
</div>
