import { RefreshCw } from 'lucide-react';
import { Button } from '@quanta/ui/button';
import { useAiChat } from '@quanta/web/contexts/ai-chat';

export function AiChatHeader() {
  const { resetChat } = useAiChat();

  return (
    <>
      <Button
        className="size-7"
        size="icon"
        variant="ghost"
        onClick={resetChat}
      >
        <RefreshCw className="size-4" />
      </Button>
    </>
  );
}
