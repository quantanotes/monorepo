import { Link } from '@tanstack/react-router';
import { MessageCircle } from 'lucide-react';
import { Button } from '@quanta/ui/button';
import { LikeButton } from '@quanta/web/components/like-button';
import { PinButton } from '@quanta/web/components/pin-button';
import { ItemTag } from '@quanta/web/components/item-tag';

interface GridCardProps {
  data: any;
}

export function GridCard({ data }: GridCardProps) {
  return (
    <Link
      to={data.spaceId ? `/s/$spaceId/$itemId` : `/$itemId`}
      params={{ itemId: data.id, spaceId: data.spaceId }}
    >
      <div className="bg-card/70 hover:bg-card/40 h-full overflow-hidden rounded-lg p-4 transition-colors">
        <h3 className="mb-6 truncate text-2xl font-semibold">
          {data.name || 'Untitled'}
        </h3>

        <div
          className="prose-xs! prose"
          dangerouslySetInnerHTML={{
            __html: data.content || '<p class="italic">No content</p>',
          }}
        />

        {data.tags && (
          <div className="flex flex-wrap gap-2 pt-3" contentEditable={false}>
            {Object.values(data.tags || {}).map((tag) => (
              <ItemTag key={tag.id} itemTag={tag} />
            ))}
          </div>
        )}

        <div className="text-muted-foreground flex w-full items-center justify-between text-sm">
          {data.username && (
            <div className="text-muted-foreground w-full truncate text-sm">
              @{data.username}
            </div>
          )}

          <div className="flex items-center justify-end gap-1">
            {Object(data).hasOwnProperty('likeCount') && (
              <LikeButton
                likeCount={data.likeCount}
                isLiked={data.isLiked}
                onToggleLike={() => {}}
              />
            )}

            {Object(data).hasOwnProperty('pinCount') && (
              <PinButton
                pinCount={data.pinCount}
                isPinned={data.isPinned}
                onTogglePin={() => {}}
              />
            )}

            {Object(data).hasOwnProperty('commentCount') && (
              <Button variant="ghost" className="h-7 p-1.5!">
                <MessageCircle className="size-4!" />
                <span className="w-3 text-xs">{data.commentCount}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
