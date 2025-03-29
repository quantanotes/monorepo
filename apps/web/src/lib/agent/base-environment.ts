import { search } from './search';
// import { browser } from './browser';
import { email } from './email';
import { csv } from './csv';
// import { db } from './db';

export function getBaseEnvironment(
  objectModel: any,
  chat: Record<string, any>,
  files: File[],
  tools: any[],
) {
  return {
    search,
    email,
    // db: db ? db(objectModel) : undefined,
    chat,
    // browser,
    csv,
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
