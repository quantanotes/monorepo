import { createFileRoute } from '@tanstack/react-router'
import { AnimatedOutlet } from '@quanta/web/components/animated-outlet';

export const Route = createFileRoute('/s/$spaceId')({
  component: AnimatedOutlet,
  ssr: false,
});
