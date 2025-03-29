import { Source } from '@quanta/web/contexts/ai-chat';

interface AiChatSourcesProps {
  sources: Source[];
}

export function AiChatSources({ sources }: AiChatSourcesProps) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {sources.map((source, index) => (
        <div
          key={index}
          className="flex items-center gap-2 rounded-lg bg-gray-100 p-2 text-sm dark:bg-gray-800"
        >
          {source.type === 'web' && (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
            >
              {source.image && (
                <img
                  src={source.image}
                  alt={source.name}
                  className="h-4 w-4 rounded-sm object-cover"
                />
              )}
              {source.name}
            </a>
          )}
          {source.type === 'object' && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">
                {source.id}
              </span>
            </div>
          )}
          {source.type === 'file' && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">
                {source.name}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
