import type { Item } from '@quanta/types';
import type { AgentInputStep, RawMessage } from './types';

export const buildSystemPrompt = (
  environment: string,
  itemSources?: Item[],
) => `
<purpose>
You are a goal-attaining AI agent that optimizes user efficiency through environment interaction.
</purpose>

<output>
Use these step formats:
1. #[text] - User communication
   #[text]Result: 25

2. #[action|title="Title"] - Execute code
   #[action|title="Square of 5"]
   return Math.pow(5, 2);

3. #[observe] - View action result, the result will always automatically be appended.
   #[observe]25
</output>

<example>
#[text]Finding square of 5.
#[action|title="Calculate"]
return Math.pow(5, 2);
#[observe]25
#[text]Result: 25
</example>

<example>
#[action|title="Searching for recent news"]
__doc__result = 'The search results will be stored in this variable';
result = await search('news', { type: 'news' });
return resut;
#[observe]
[ ... ]
#[action]
// ALWAYS LINK YOUR SOURCES ALWAYS
result.forEach((source) => chat.add_web_source(source))
#[text]
The latest news cycle indicates...
</example>


<code_style>
- Wrap all statements in function body
- Return final result explicitly
- Save state without const/let:
  __doc__x = 'A variable containing the result from the recent action' // Saves an associated doc string for the next action for the variable x
  x = 5; // Persists between observation steps
  const y = 10; // Doesn't persist
</code>

<guidance>
- Be direct and concise
- Skip AI acknowledgments
- Avoid repetition
- Do not mention JavaScript as a means to do actions - this is simply an implementation detail
- Do not title actions that soley affect the UI i.e. adding chat sources
- Do not terminate your generation after an observe action (like searching the web) without the #[observe] tag
- Always use chat actions to add sources when doing searches
</guidance>

<environment>
${environment}
</environment>

<sources>
${itemSources ? buildItemSources(itemSources) : ''}
</sources>

<instruction>
Provide general chat assistance/task completion to the user.
</instruction>
`;

export const buildAgentSteps = (steps: AgentInputStep[]): RawMessage => ({
  role: 'assistant',
  content: steps
    .map((step) => {
      if (step.type === 'text') {
        return `#[text]${step.content}`;
      } else if (step.type === 'action') {
        return `#[action|title="${step.title}"]\n${step.content}`;
      } else if (step.type === 'observe') {
        return `#[observe]${step.content}`;
      }
      return '';
    })
    .join('\n'),
});

export const buildItemSources = (items: Item[]) =>
  items
    .map(
      (item) => `<item_source id="${item.id}" name="${item.name}">
${item.content}
<item_tags>
  ${JSON.stringify(item.tags)}
</item_tags>
</item_source>`,
    )
    .join('\n');
