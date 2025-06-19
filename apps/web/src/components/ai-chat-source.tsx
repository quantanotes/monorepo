import { useMemo } from 'react';
import { StickyNote, Globe, FileText, ExternalLink } from 'lucide-react';
import { useSpace } from '@quanta/web/hooks/use-space';
import clsx from 'clsx';

interface AiChatSourceProps {
  source: any;
}

export function AiChatSource({ source }: AiChatSourceProps) {
  const space = useSpace();

  const link = useMemo(() => {
    if (source.type === 'object' && 'id' in source) {
      return `/s/${space?.id}/${source.id}`;
    } else if (source.type === 'web' && 'url' in source) {
      return source.url;
    }
    return null;
  }, [source, space?.id]);

  const isExternal = source.type === 'web';

  const Icon = () => {
    switch (source.type) {
      case 'item':
        return (
          <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
            <StickyNote className="size-4" />
          </div>
        );
      case 'web':
        return (
          <div className="flex size-8 items-center justify-center rounded-md bg-blue-500/10 text-blue-500">
            <Globe className="size-4" />
          </div>
        );
      case 'file':
        return (
          <div className="flex size-8 items-center justify-center rounded-md bg-orange-500/10 text-orange-500">
            <FileText className="size-4" />
          </div>
        );
    }
  };

  const getTitle = () => {
    return (
      source.name ||
      (source.type === 'object'
        ? 'Object'
        : source.type === 'web'
          ? 'Web source'
          : 'File')
    );
  };

  const getContentPreview = () => {
    if (source.type === 'object' && source.content) {
      const parser = new DOMParser();
      const text = parser.parseFromString(source.content, 'text/html').body
        .textContent;
      return text
        ? text.length > 150
          ? text.substring(0, 150) + '...'
          : text
        : null;
    }
    return null;
  };

  return (
    <a
      href={link || undefined}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={clsx(
        'group bg-card/50 relative flex flex-col overflow-hidden rounded-md border p-3 text-left text-sm transition-all duration-200',
        'hover:bg-card hover:shadow-md',
        isExternal && 'hover:scale-[1.02]',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon />
          <div className="flex flex-col">
            <div className="line-clamp-1 font-medium">{getTitle()}</div>
            {source.type === 'web' && source.url && (
              <div className="text-muted-foreground line-clamp-1 text-xs">
                {new URL(source.url).hostname}
              </div>
            )}
          </div>
        </div>
        {isExternal && (
          <div className="text-muted-foreground/40 group-hover:text-muted-foreground">
            <ExternalLink className="size-4" />
          </div>
        )}
      </div>

      {source.type === 'object' && getContentPreview() && (
        <div className="text-muted-foreground mt-2 line-clamp-2 text-xs">
          {getContentPreview()}
        </div>
      )}

      {source.type === 'web' && source.image && (
        <div className="mt-2 aspect-video w-full overflow-hidden rounded">
          <img
            src={source.image}
            alt={source.name || 'web preview'}
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </a>
  );
}
