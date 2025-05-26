import { createContext, use } from 'react';
import { useDB } from '@quanta/web/contexts/db';
import { useSpace } from '@quanta/web/hooks/use-space';
import { ToolModel } from '@quanta/web/lib/tool-model';

type ToolContextType = ReturnType<typeof makeToolContext> | undefined;

const ToolContext = createContext<ToolContextType>(undefined);

export function ToolProvider({ children }: React.PropsWithChildren) {
  const db = useDB();
  const space = useSpace();

  if (!db || !space) {
    return <ToolContext value={undefined}>{children}</ToolContext>;
  } else {
    const toolModel = new ToolModel(db, space?.id);
    const value = makeToolContext(toolModel);
    return <ToolContext value={value}>{children}</ToolContext>;
  }
}

export function useTools() {
  return use(ToolContext);
}

function makeToolContext(toolModel: ToolModel) {
  async function useToolsLive() {
    return toolModel.useToolsLive();
  }

  async function createTool(type: string) {
    return await toolModel.create(type);
  }

  async function updateTool(id: string, config: any) {
    return await toolModel.update(id, config);
  }

  async function deleteTool(id: string) {
    return await toolModel.delete(id);
  }

  return {
    useToolsLive,
    createTool,
    updateTool,
    deleteTool,
  };
}
