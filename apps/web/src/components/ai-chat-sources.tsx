import { useState } from 'react';
import { Globe, StickyNote, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@quanta/ui/button';
import { AiChatSource } from '@quanta/web/components/ai-chat-source';

const INITIAL_DISPLAY_COUNT = 3;

interface AiChatSourcesProps {
  sources: any[];
}

export function AiChatSources({ sources }: AiChatSourcesProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    web: false,
    item: false,
    file: false,
  });

  const toggleSection = (type: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const getDisplaySources = (sources: any[], type: string) => {
    return expandedSections[type]
      ? sources
      : sources.slice(0, INITIAL_DISPLAY_COUNT);
  };

  const webSources = sources.filter((s) => s.type === 'web');
  const itemSources = sources.filter((s) => s.type === 'item');
  const fileSources = sources.filter((s) => s.type === 'file');

  const sections = [
    { type: 'web', icon: Globe, label: 'Web Sources', sources: webSources },
    { type: 'item', icon: StickyNote, label: 'Items', sources: itemSources },
    { type: 'file', icon: FileText, label: 'Files', sources: fileSources },
  ];

  if (sources.length === 0) return null;

  return (
    <div className="mt-3 flex flex-col gap-4">
      {sections.map((section) =>
        section.sources.length > 0 ? (
          <div key={section.type} className="flex flex-col gap-2">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <section.icon className="size-4" />
              <span className="font-medium">{section.label}</span>
              <span className="text-muted-foreground/60">
                ({section.sources.length})
              </span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-2">
              {getDisplaySources(section.sources, section.type).map(
                (source, i) => (
                  <AiChatSource key={i} source={source} />
                ),
              )}
            </div>
            {section.sources.length > INITIAL_DISPLAY_COUNT && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 w-fit"
                onClick={() => toggleSection(section.type)}
              >
                <ChevronDown
                  size={16}
                  className={
                    expandedSections[section.type]
                      ? 'rotate-180 transform transition-transform'
                      : 'transition-transform'
                  }
                />
                {expandedSections[section.type]
                  ? 'Show less'
                  : `Show ${section.sources.length - INITIAL_DISPLAY_COUNT} more`}
              </Button>
            )}
          </div>
        ) : null,
      )}
    </div>
  );
}
