<script>
  import { ArrowRight } from 'lucide-svelte';
  import { Button } from '#/ui/button';
  import { Input } from '#/ui/input';
  import { getChatContext } from '$/chat.svelte';

  let value = $state('');

  const chat = getChatContext();

  function send() {
    if (value.trim().length > 0) {
      chat.send(value);
      value = '';
    }
  }
</script>

<div
  class="bg-background/50 border max-w-4xl -translate-x-1/2 left-1/2 absolute bottom-4 z-10 flex w-full px-4 py-2 backdrop-blur-md"
>
  <Input
    class="flex-grow border-0 bg-opacity-0 !text-xl focus-visible:ring-0 focus-visible:ring-offset-0"
    placeholder="Enter a task you would like to perform..."
    bind:value
    onkeydown={(event) => {
      if (event.key === 'Enter') {
        send();
      }
    }}
  />

  <Button variant="ghost" size="icon" onclick={send}>
    <ArrowRight class="!size-6" />
  </Button>
</div>
