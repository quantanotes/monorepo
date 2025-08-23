import { CheckIcon, LoaderCircleIcon, XIcon } from 'lucide-react';
import { useAiChat } from '@quanta/web/contexts/ai-chat';

interface AiChatActionProps {
  title: string;
  status: 'pending' | 'completed' | 'failed';
}

export function AiChatAction({ title, status }: AiChatActionProps) {
  const ActionStatusIndicator = () => {
    switch (status) {
      case 'completed':
        return <CheckIcon className="size-4" />;
      case 'pending':
        return <LoaderCircleIcon className="size-4 animate-spin" />;
      case 'failed':
        return <XIcon className="size-4" />;
    }
  };

  return (
    <div className="bg-muted text-muted-foreground flex items-center gap-4 rounded-md px-3 py-1">
      <ActionStatusIndicator />
      {title && <div className="mb-1">{title}</div>}
    </div>
  );
}
