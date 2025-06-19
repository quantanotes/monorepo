import { search } from './search';
import { browser } from './browser';
import { email } from './email';
import { csv } from './csv';
import { db } from './db';
import type { ItemModelLocal } from '@quanta/web/lib/item-model-local';
import type { TagModel } from '@quanta/web/lib/tag-model';

export function baseAgentEnvironment(
  chat: Record<string, any>,
  files: File[],
  tools: any[],
  itemModel?: ItemModelLocal,
  tagModel?: TagModel,
) {
  return {
    search,
    email,
    chat,
    browser,
    csv,

    db: itemModel && tagModel ? db(itemModel, tagModel) : undefined,

    __doc__files: filesDoc(files),
    files,

    __doc__tools: toolsDoc(tools),
    tools,
  };
}

function filesDoc(files: File[]) {
  return `File[]
Provides you access to the user's attached files.
Here is the file array you can acesss from:
${files.map((file, i) => `${i}: Name: ${file.name}`).join('\n')}
Example:
files[1]`;
}

function toolsDoc(tools: any[]) {
  return `Tool[]
Provides you access to the user's integrated tools.
Here is the tool array you can acesss from:
${tools.map((tool, i) => `${i}: Name: ${tool.name} Type: ${tool.type}`).join('\n')}
Example:
tools[3]`;
}
