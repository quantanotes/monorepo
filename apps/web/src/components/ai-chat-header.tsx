import { RefreshCw } from 'lucide-react';
import { Button } from '@quanta/ui/button';
import { useAiChat } from '@quanta/web/contexts/ai-chat';

export function AiChatHeader() {
  const { resetChat } = useAiChat();

  return (
    <>
      <Button size="icon" variant="ghost" onClick={resetChat}>
        <RefreshCw className="size-5" />
      </Button>
    </>
  );
}
