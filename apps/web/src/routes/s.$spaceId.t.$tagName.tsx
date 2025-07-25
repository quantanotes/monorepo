import { useState } from 'react';
import { useNavigate, createFileRoute } from '@tanstack/react-router';
import { exportItemsCsv } from '@quanta/web/lib/export-csv';
import { useTagModelLocal } from '@quanta/web/hooks/use-tag-model-local';
import { useItemModelLocal } from '@quanta/web/hooks/use-item-model-local';
import { useSpace } from '@quanta/web/hooks/use-space';
import { usePinnedLocal } from '@quanta/web/hooks/use-pinned-local';
import { PageLayout } from '@quanta/web/components/page-layout';
import { Query } from '@quanta/web/components/query';
import { ViewMenu } from '@quanta/web/components/view-menu';
import { PinButton } from '@quanta/web/components/pin-button';
import { TagPageMenu } from '@quanta/web/components/tag-page-menu';

export const Route = createFileRoute('/s/$spaceId/t/$tagName')({
  component: RouteComponent,
});

function RouteComponent() {
  const { tagName } = Route.useParams();
  const { useTagLive, useTagChildrenLive, deleteTag } = useTagModelLocal();
  const { useSearchItemsLive } = useItemModelLocal()!;
  const { isTagPinned, togglePinTag } = usePinnedLocal()!;
  const navigate = useNavigate();
  const space = useSpace()!;
  const tag = useTagLive(tagName);
  const items = useSearchItemsLive('', [{ tag: tagName }]);
  const tagChildren = useTagChildrenLive(tagName);
  const isPinned = tag ? isTagPinned(tagName) : false;
  const [view, setView] = useState('grid');

  const handleTogglePin = () => {
    if (tag) {
      togglePinTag(tag.id);
    }
  };

  const handleDelete = () => {
    deleteTag(tagName);
    navigate({ to: '/s/$spaceId', params: { spaceId: space.id } });
  };

  const handleExportCsv = () => {
    exportItemsCsv(items, tagChildren);
  };

  return (
    <PageLayout
      title={`#${tagName}`}
      headerMenu={
        <>
          <ViewMenu
            views={['table', 'grid']}
            currentView={view}
            onViewChange={setView}
          />

          <PinButton isPinned={isPinned} onTogglePin={handleTogglePin} />

          <TagPageMenu
            tagName={tagName}
            isPinned={isPinned}
            onTogglePin={handleTogglePin}
            onDelete={handleDelete}
            onExportCsv={handleExportCsv}
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
