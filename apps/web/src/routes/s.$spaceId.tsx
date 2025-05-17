import { Outlet } from '@tanstack/react-router';

export const Route = createFileRoute({
  component: RouteComponent,
  ssr: false,
});

function RouteComponent() {
  return <Outlet />;
}
