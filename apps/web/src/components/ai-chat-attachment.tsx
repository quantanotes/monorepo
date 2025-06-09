import { XIcon } from 'lucide-react';
import { Button } from '@quanta/ui/button';
import { useAiChat } from '@quanta/web/contexts/ai-chat';

interface AiChatAttachmentProps {
  index: number;
}

export function AiChatAttachment({ index }: AiChatAttachmentProps) {
  const { attachments, removeAttachment } = useAiChat();
  const attachment = attachments[index];
  const name = attachment.file?.name || attachment.itemId;

  const handleRemove = () => {
    removeAttachment(index);
  };

  return (
    <div className="flex items-center gap-1 rounded-full border px-2 py-1 text-sm">
      {name}
      <Button
        variant="ghost"
        size="icon"
        className="hover:text-destructive size-4"
        onClick={handleRemove}
      >
        <XIcon className="size-3" />
      </Button>
    </div>
  );
}
