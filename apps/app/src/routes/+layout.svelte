<script>
  import { blur } from 'svelte/transition';
  import { page } from '$app/state';
  import { ScrollArea } from '#/ui/scroll-area';
  import Navbar from '$/components/navbar.svelte';
  import Input from '$/components/input.svelte';
  import { ChatStore, setChatContext } from '$/chat.svelte';
  import '#/ui/styles.css';

  let { children } = $props();

  setChatContext(new ChatStore());
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<Navbar />
{#key page.url}
  <div class="absolute" transition:blur>
    <ScrollArea class="relative h-screen w-screen">
      {@render children?.()}
    </ScrollArea>
  </div>
{/key}
<Input />
