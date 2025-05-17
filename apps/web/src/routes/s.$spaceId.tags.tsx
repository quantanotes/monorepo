import { Link } from '@tanstack/react-router';
import { Badge } from '@quanta/ui/badge';
import { useSpace } from '@quanta/web/hooks/use-space';
import { useTagModelLocal } from '@quanta/web/hooks/use-tag-model-local';
import { PageLayout } from '@quanta/web/components/page-layout';

export const Route = createFileRoute({
  component: RouteComponent,
});

function RouteComponent() {
  const { useAllTagsLive } = useTagModelLocal();
  const tags = useAllTagsLive();
  const space = useSpace()!;

  return (
    <PageLayout title="tags">
      {tags.map((tag) => (
        <Badge
          key={tag.id as string}
          className="text-2xl"
          variant="outline"
          asChild
        >
          <Link
            to="/s/$spaceId/t/$tagName"
            params={{ spaceId: space.id, tagName: tag.name }}
          >
            #{tag.name}
          </Link>
        </Badge>
      ))}
    </PageLayout>
  );
}
