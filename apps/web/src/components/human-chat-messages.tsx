import { useHumanChat } from '@quanta/web/contexts/human-chat';
import { HumanChatMessage } from '@quanta/web/components/human-chat-message';
import { Loader2 } from 'lucide-react';

export function HumanChatMessages() {
  const { comments, loading, deleteComment } = useHumanChat();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-muted-foreground flex h-64 items-center justify-center text-center">
        <div>
          <p>No comments yet</p>
          <p className="text-sm">Be the first to start the discussion</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {comments.map((comment) => (
        <HumanChatMessage
          key={comment.id}
          comment={comment}
          onDelete={deleteComment}
        />
      ))}
    </div>
  );
}
