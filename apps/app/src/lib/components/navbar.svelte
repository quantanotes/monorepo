<script>
  import { LayoutGrid } from 'lucide-svelte';
  import { Button } from '#/ui/button';
  import { ScrollArea } from '#/ui/scroll-area';
</script>

<div class="absolute top-0 w-full py-2 px-8 flex justify-between items-center bg-background/50 backdrop-blur-md z-50">
  <a class="text-lg font-medium" href="/">QUANTA</a>
  
  <Button class="text-lg" variant="ghost">
    <LayoutGrid class="!size-6"  />
    Explore Apps
  </Button>
</div>
