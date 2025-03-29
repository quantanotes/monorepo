import { useAiChat } from '@quanta/web/contexts/ai-chat';

interface AiChatActionProps {
  messageIndex: number;
  actionIndex: number;
  title?: string;
  content: string;
  status?: 'pending' | 'completed' | 'failed';
}

export function AiChatAction({
  messageIndex,
  actionIndex,
  title,
  content,
  status = 'pending',
}: AiChatActionProps) {
  const { setActionStatus } = useAiChat();

  function executeAction() {
    setActionStatus(messageIndex, actionIndex, 'completed');
  }

  return (
    <div className="mt-1 rounded-md border p-3">
      {title && <div className="mb-1 font-semibold">{title}</div>}
      <pre className="overflow-auto text-sm whitespace-pre-wrap">{content}</pre>
    </div>
  );
}
