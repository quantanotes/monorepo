import { useHumanChat } from '@quanta/web/contexts/human-chat';
import { Button } from '@quanta/ui/button';
import { AutosizeTextarea } from '@quanta/ui/autoresize-textarea';
import { Send } from 'lucide-react';
import { useCallback } from 'react';

export function HumanChatInput() {
  const { value, setValue, addComment } = useHumanChat();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addComment();
      }
    },
    [addComment],
  );

  return (
    <div className="bg-card flex flex-col gap-2 rounded-md">
      <div className="flex items-center justify-between overflow-visible p-2">
        <AutosizeTextarea
          value={value}
          minHeight={0}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add to the discussion..."
          rows={1}
          className="placeholder:text-muted-foreground/60 h-fit min-h-0 w-full resize-none border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-0"
        />

        <Button
          variant={value.trim() ? 'default' : 'ghost'}
          size="icon"
          onClick={addComment}
          disabled={!value.trim()}
        >
          <Send className="size-5" />
        </Button>
      </div>
    </div>
  );
}
