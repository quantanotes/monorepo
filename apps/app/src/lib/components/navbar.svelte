<script>
  import { LayoutGrid } from 'lucide-svelte';
  import { Button } from '#/ui/button';
  import { ScrollArea } from '#/ui/scroll-area';
</script>

<div
  class="bg-background/50 absolute top-0 z-10 flex w-full items-center justify-between px-8 py-2 backdrop-blur-md"
>
  <a class="text-lg font-medium" href="/">QUANTA</a>

  <Button class="text-lg" variant="ghost">
    <LayoutGrid class="!size-6" />
    Explore Apps
  </Button>
</div>
