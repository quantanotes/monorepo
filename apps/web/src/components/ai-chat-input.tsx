import { useRef, useState } from 'react';
import {
  PlusIcon,
  Loader2Icon,
  ArrowUpIcon,
  Settings2Icon,
  SearchIcon,
  BrainIcon,
} from 'lucide-react';
import { AutosizeTextarea } from '@quanta/ui/autoresize-textarea';
import { Button } from '@quanta/ui/button';
import { Toggle } from '@quanta/ui/toggle';
import { useAiChat } from '@quanta/web/contexts/ai-chat';
import { useFrame } from '@quanta/web/hooks/use-frame';
import { useMeasure } from '@quanta/web/hooks/use-measure';
import { AiChatFileInput } from '@quanta/web/components/ai-chat-file-input';
import { AiChatAttachments } from '@quanta/web/components/ai-chat-attachments';
import type { AutosizeTextAreaRef } from '@quanta/ui/autoresize-textarea';
import { AiChatSettings } from './ai-chat-settings';

const TOGGLE_BREAKPOINT = 500;

export function AiChatInput() {
  const { input, setInput, running, send, abort } = useAiChat();
  const [ref, { width }] = useMeasure();
  const textareaRef = useRef<AutosizeTextAreaRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chatShadowHue, setChatShadowHue] = useState(0);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    send();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  useFrame((dt) => {
    setChatShadowHue((prevHue) => (prevHue + 0.1 * dt) % 360);
  }, running);

  return (
    <div className="bg-card rounded-md" ref={ref}>
      <div
        className="flex flex-col gap-2 rounded-md p-2 transition-all duration-200"
        style={{
          boxShadow: running
            ? `0 0 16px 8px hsla(${chatShadowHue}, 80%, 80%, 0.3)`
            : '',
        }}
      >
        <AiChatFileInput ref={fileInputRef} />

        <div className="flex items-center justify-between">
          <AutosizeTextarea
            ref={textareaRef}
            value={input}
            minHeight={40}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            className="placeholder:text-muted-foreground/60 h-fit min-h-0 w-full resize-none border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-0"
          />
        </div>

        <div className="flex justify-between">
          <div className="flex gap-1">
            <Button
              className="size-7"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={running}
            >
              <PlusIcon className="size-4" />
            </Button>

            <AiChatSettings containerWidth={width} />
          </div>

          <Button
            className="size-7"
            variant={input.trim().length ? 'default' : 'ghost'}
            size="icon"
            onClick={running ? abort : handleSubmit}
            disabled={!running && !input.trim()}
          >
            {running ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <ArrowUpIcon className="size-4" />
            )}
          </Button>
        </div>

        <AiChatAttachments />
      </div>
    </div>
  );
}
