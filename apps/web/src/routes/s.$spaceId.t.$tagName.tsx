import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { X } from 'lucide-react';
import { Button } from '@quanta/ui/button';
import { useTagModelLocal } from '@quanta/web/hooks/use-tag-model-local';
import { useItemModelLocal } from '@quanta/web/hooks/use-item-model-local';
import { useSpace } from '@quanta/web/hooks/use-space';
import { usePinnedLocal } from '@quanta/web/hooks/use-pinned-local';
import { PageLayout } from '@quanta/web/components/page-layout';
import { Query } from '@quanta/web/components/query';
import { ViewMenu } from '@quanta/web/components/view-menu';
import { PinButton } from '@quanta/web/components/pin-button';
import { TagPageMenu } from '@quanta/web/components/tag-page-menu';

export const Route = createFileRoute({
  component: RouteComponent,
});

function RouteComponent() {
  const { tagName } = Route.useParams();
  const navigate = useNavigate();
  const space = useSpace()!;
  const { useTagChildrenLive, deleteTag } = useTagModelLocal();
  const { useSearchItemsLive } = useItemModelLocal()!;
  const { isTagPinned, togglePinTag } = usePinnedLocal()!;
  const items = useSearchItemsLive('', [{ tag: tagName }]);
  const tagChildren = useTagChildrenLive(tagName);
  const [view, setView] = useState('grid');

  return (
    <PageLayout
      title={`#${tagName}`}
      headerMenu={
        <>
          <PinButton
            isPinned={isTagPinned(tagName)}
            onTogglePin={() => togglePinTag(tagName)}
          />

          <ViewMenu
            views={['table', 'grid']}
            currentView={view}
            onViewChange={setView}
          />

          <TagPageMenu
            tagName={tagName}
            isPinned={isTagPinned(tagName)}
            onTogglePin={() => togglePinTag(tagName)}
            onDelete={() => {
              deleteTag(tagName);
              navigate({ to: '/s/$spaceId', params: { spaceId: space.id } });
            }}
          />
        </>
      }
    >
      <Query
        items={items}
        tags={tagChildren.map((tag) => tag?.name)}
        view={view}
      />
    </PageLayout>
  );
}
