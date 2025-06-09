import { useAiChat } from '@quanta/web/contexts/ai-chat';

interface AiChatFileInputProps {
  ref: React.Ref<HTMLInputElement>;
}

export function AiChatFileInput({ ref }: AiChatFileInputProps) {
  const { addAttachment } = useAiChat();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target?.files) {
      for (const file of Array.from(event.target.files)) {
        addAttachment('file', file);
      }
    }
  };

  return (
    <input
      ref={ref}
      className="hidden"
      type="file"
      multiple
      onChange={handleChange}
    />
  );
}
