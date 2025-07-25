import { Link, createFileRoute } from '@tanstack/react-router';
import { Badge } from '@quanta/ui/badge';
import { useSpace } from '@quanta/web/hooks/use-space';
import { useTagModelLocal } from '@quanta/web/hooks/use-tag-model-local';
import { usePinnedLocal } from '@quanta/web/hooks/use-pinned-local';
import { PageLayout } from '@quanta/web/components/page-layout';
import { TagPageMenu } from '@quanta/web/components/tag-page-menu';

export const Route = createFileRoute('/s/$spaceId/tags')({
  component: RouteComponent,
});

function RouteComponent() {
  const { useAllTagsLive, deleteTag } = useTagModelLocal();
  const { isTagPinned, togglePinTag } = usePinnedLocal();
  const tags = useAllTagsLive();
  const space = useSpace()!;

  const handleDelete = (name: string) => () => {
    deleteTag(name);
  };

  const handleTogglePin = (id: string) => () => {
    togglePinTag(id);
  };

  // TODO: move tag in to it's own component
  return (
    <PageLayout title="tags">
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <div className="group/menu-item relative rounded-md border">
            <Badge
              key={tag.id as string}
              className="bg-background peer/menu-button justify-start truncate border-0 text-2xl"
              variant="outline"
              asChild
            >
              <Link
                to="/s/$spaceId/t/$tagName"
                params={{ spaceId: space.id, tagName: tag.name }}
              >
                <span className="mr-9 truncate">#{tag.name}</span>
              </Link>
            </Badge>

            <TagPageMenu
              className="peer-hover/menu-button:text-accent-foreground absolute right-0 bottom-0 opacity-0 transition-opacity group-hover/menu-item:opacity-100"
              tagName={tag.name}
              isPinned={isTagPinned(tag.name)}
              onDelete={handleDelete(tag.name)}
              onTogglePin={handleTogglePin(tag.id)}
              // onExportCsv={handleExportCsv(tag.id)}
            />
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
