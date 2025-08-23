import { Button } from '@quanta/ui/button';
import { Toggle } from '@quanta/ui/toggle';
import { BrainIcon, SearchIcon, Settings2Icon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@quanta/ui/dropdown-menu';
import { useAiChat } from '@quanta/web/contexts/ai-chat';

interface AiChatSettingsProps {
  containerWidth: number;
  breakpoint?: number;
}

export function AiChatSettings({
  containerWidth,
  breakpoint = 320,
}: AiChatSettingsProps) {
  const {
    isAgentEnabled,
    toggleAgent,
    isWebSearchEnabled,
    toggleWebSearch,
    isSpaceSearchEnabled,
    toggleSpaceSearch,
  } = useAiChat();

  const showTogglesInline = containerWidth >= breakpoint;

  const withPreventDefault = (f) => (e) => {
    e.preventDefault();
    f();
  };

  if (showTogglesInline) {
    return (
      <div className="flex gap-1">
        <Toggle
          className="h-7"
          pressed={isAgentEnabled}
          onPressedChange={toggleAgent}
        >
          <BrainIcon /> Agent
        </Toggle>

        <Toggle
          className="h-7"
          pressed={isSpaceSearchEnabled}
          onPressedChange={toggleSpaceSearch}
        >
          <SearchIcon className="size-4" /> Space
        </Toggle>

        <Toggle
          className="h-7"
          pressed={isWebSearchEnabled}
          onPressedChange={toggleWebSearch}
        >
          <SearchIcon className="size-4" /> Web
        </Toggle>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" variant="outline" size="icon">
          <Settings2Icon className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuCheckboxItem
          checked={isAgentEnabled}
          onClick={withPreventDefault(toggleAgent)}
        >
          <BrainIcon className="size-4" />
          Agent
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={isSpaceSearchEnabled}
          onClick={withPreventDefault(toggleSpaceSearch)}
        >
          <SearchIcon className="size-4" />
          Space Search
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={isWebSearchEnabled}
          onClick={withPreventDefault(toggleWebSearch)}
        >
          <SearchIcon className="size-4" />
          Web Search
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
