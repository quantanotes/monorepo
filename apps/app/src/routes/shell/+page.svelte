<script>
  import Island from '$/components/island.svelte';
  import { getChatContext } from '$/chat.svelte';

  let chat = getChatContext();
</script>

<div class="flex flex-col gap-6 pb-96 pt-20 max-w-4xl mx-auto">
  {#each chat.messages as message}
    {#if message.role === 'render'}
        <div class="w-fit p-8 border-l-6 bg-card/50 mx-8">
          <Island code={message.content}>I'm an island boy</Island>
      </div>
    {:else}
      <div
        class={[
          'mx-8',
          message.role !== 'user' ? 'text-xl' : 'text-4xl font-semibold',
        ]}
      >
        {message.content}
      </div>
    {/if}
  {/each}
</div>
