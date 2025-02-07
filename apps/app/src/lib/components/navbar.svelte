<script>
  import { goto } from '$app/navigation';
  import { LayoutGrid } from 'lucide-svelte';
  import { Button } from '#/ui/button';
</script>

<div
  class="bg-background/50 border-b absolute top-0 z-10 flex w-full items-center justify-between px-8 py-2 backdrop-blur-md"
>
  <a class="text-lg font-medium" href="/">QUANTA</a>

  <Button class="text-lg" variant="ghost" onclick={() => goto('/explore')}>
    <LayoutGrid class="!size-6" />
    Explore Apps
  </Button>
</div>
