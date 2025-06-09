import { useAiChat } from '@quanta/web/contexts/ai-chat';
import { AiChatAttachment } from '@quanta/web/components/ai-chat-attachment';

export function AiChatAttachments() {
  const { attachments, removeAttachment } = useAiChat();

  if (attachments.length === 0) {
    return <></>;
  }

  return (
    <div className="flex flex-wrap gap-2 px-3 pb-3">
      {attachments.map((_, i) => (
        <AiChatAttachment index={i} />
      ))}
    </div>
  );
}
