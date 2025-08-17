import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/s/$spaceId')({
  component: Outlet,
  ssr: false,
});
