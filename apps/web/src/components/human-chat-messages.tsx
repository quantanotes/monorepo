import { useHumanChat } from '@quanta/web/contexts/human-chat';
import { HumanChatMessage } from '@quanta/web/components/human-chat-message';
import { Loader2 } from 'lucide-react';

export function HumanChatMessages() {
  const { comments, deleteComment } = useHumanChat();

  return (
    <div className="flex flex-col">
      {comments.map((comment) => (
        <HumanChatMessage
          key={comment.id}
          comment={comment}
          onDelete={deleteComment}
        />
      ))}
      <div className="h-96" />
    </div>
  );
}
