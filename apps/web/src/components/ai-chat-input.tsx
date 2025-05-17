import { useEffect } from 'react';
import { useAiChat } from '@quanta/web/contexts/ai-chat';
import { useCallback, useRef, useState } from 'react';
import {
  AutosizeTextarea,
  type AutosizeTextAreaRef,
} from '@quanta/ui/autoresize-textarea';
import { Button } from '@quanta/ui/button';
import { Plus, X, Loader2, ArrowUp } from 'lucide-react';

export function AiChatInput() {
  const { value, setValue, running, send, files, setFiles, handleAbort } =
    useAiChat();
  const textareaRef = useRef<AutosizeTextAreaRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chatShadowHue, setChatShadowHue] = useState(0);
  const isTyping = value.length > 0;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      send();
    },
    [send],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    [send],
  );

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    const hueSpeed = 0.1;

    const animateHue = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      setChatShadowHue((prevHue) => (prevHue + hueSpeed * deltaTime) % 360);
      animationFrameId = requestAnimationFrame(animateHue);
    };

    if (running) {
      animationFrameId = requestAnimationFrame(animateHue);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [running]);

  return (
    <div className="flex flex-col gap-2">
      <div
        className="rounded-lg transition-all duration-200"
        style={
          running
            ? {
                boxShadow: `0 0 16px 8px hsla(${chatShadowHue}, 80%, 80%, 0.3)`,
              }
            : {}
        }
      >
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          multiple
          accept=".txt,.pdf,.doc,.docx,.csv,.json,.js,.ts,.py,.html,.css"
          onChange={(e) => {
            if (e.target.files) {
              const selectedFiles = Array.from(e.target.files).map((file) => {
                const fileWithPreview = Object.assign(file, {
                  preview: URL.createObjectURL(file),
                });
                return fileWithPreview;
              });
              setFiles([...files, ...selectedFiles]);
            }
          }}
        />

        <div className="flex items-center justify-between p-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 flex-none"
            onClick={() => fileInputRef.current?.click()}
            disabled={running}
          >
            <Plus className="size-5" />
          </Button>

          <AutosizeTextarea
            ref={textareaRef}
            value={value}
            minHeight={0}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            className="placeholder:text-muted-foreground/60 h-fit min-h-0 w-full resize-none border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-0"
          />

          <Button
            variant={isTyping ? 'default' : 'ghost'}
            size="icon"
            onClick={running ? handleAbort : handleSubmit}
            disabled={!running && !value.trim()}
          >
            {running ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <ArrowUp className="size-5" />
            )}
          </Button>
        </div>

        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3 pb-3">
            {files.map((file, i) => (
              <div
                key={file.name}
                className="animate-in fade-in slide-in-from-bottom-2 flex items-center gap-1 rounded-full border px-2 py-1 text-sm"
              >
                {file.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-destructive size-4"
                  onClick={() => {
                    const newFiles = [...files];
                    newFiles.splice(i, 1);
                    setFiles(newFiles);
                  }}
                >
                  <X className="size-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
