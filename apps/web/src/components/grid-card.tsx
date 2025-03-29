import { Link } from '@tanstack/react-router';
import { MessageCircle } from 'lucide-react';
import { LikeButton } from '@quanta/web/components/like-button';
import { PinButton } from '@quanta/web/components/pin-button';
import { Button } from '@quanta/ui/button';

export function GridCard({ data }) {
  return (
    <Link to={`/$itemId`} params={{ itemId: data.id }}>
      <div className="bg-card/70 hover:bg-accent/50 h-full overflow-hidden rounded-md border p-4 transition-colors">
        <h3 className="text-card-foreground mb-2 truncate text-lg font-semibold">
          {data.name || 'Untitled'}
        </h3>

        <div
          className="prose-sm prose-themed text-muted-foreground line-clamp-[24]"
          dangerouslySetInnerHTML={{
            __html:
              data.content ||
              '<p class="text-muted-foreground/50 italic">No content</p>',
          }}
        />

        <div className="mt-4 flex items-center justify-between border-t pt-2">
          <span className="text-card-foreground text-sm">@username</span>
          <div className="flex items-center gap-2">
            <LikeButton
              likeCount={data.likeCount}
              isLiked={data.isLiked}
              onToggleLike={() => {}}
            />

            <PinButton
              pinCount={data.pinCount}
              isPinned={data.isPinned}
              onTogglePin={() => {}}
            />

            <Button variant="ghost" className="h-8">
              <MessageCircle className="size-5" />
              <span className="text-xs">{data.commentCount}</span>
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
