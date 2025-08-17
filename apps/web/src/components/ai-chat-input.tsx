import { useRef, useState } from 'react';
import { Plus, Loader2, ArrowUp } from 'lucide-react';
import { Button } from '@quanta/ui/button';
import {
  AutosizeTextarea,
  type AutosizeTextAreaRef,
} from '@quanta/ui/autoresize-textarea';
import { useAiChat } from '@quanta/web/contexts/ai-chat';
import { useFrame } from '@quanta/web/hooks/use-frame';
import { AiChatFileInput } from '@quanta/web/components/ai-chat-file-input';
import { AiChatAttachments } from '@quanta/web/components/ai-chat-attachments';

export function AiChatInput() {
  const { input, setInput, running, send, abort } = useAiChat();
  const textareaRef = useRef<AutosizeTextAreaRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chatShadowHue, setChatShadowHue] = useState(0);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    send();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  useFrame((dt) => {
    setChatShadowHue((prevHue) => (prevHue + 0.1 * dt) % 360);
  }, running);

  return (
    <div className="bg-card flex flex-col gap-2 rounded-md">
      <div
        className="rounded-md transition-all duration-200"
        style={{
          boxShadow: running
            ? `0 0 16px 8px hsla(${chatShadowHue}, 80%, 80%, 0.3)`
            : '',
        }}
      >
        <AiChatFileInput ref={fileInputRef} />

        <div className="flex items-center justify-between p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={running}
          >
            <Plus className="size-4" />
          </Button>

          <AutosizeTextarea
            ref={textareaRef}
            value={input}
            minHeight={0}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            className="placeholder:text-muted-foreground/60 h-fit min-h-0 w-full resize-none border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-0"
          />

          <Button
            variant={input.trim().length ? 'default' : 'ghost'}
            size="icon"
            onClick={running ? abort : handleSubmit}
            disabled={!running && !input.trim()}
          >
            {running ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowUp className="size-4" />
            )}
          </Button>
        </div>

        <AiChatAttachments />
      </div>
    </div>
  );
}
