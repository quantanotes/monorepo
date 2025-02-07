import { Hono } from 'hono';
import { streamText } from 'hono/streaming';
import { StreamingApi } from 'hono/utils/stream';
import OpenAI from 'openai/index';
import type {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from 'openai/resources/chat/index';
import { JSONSchema } from 'openai/lib/jsonschema';
import { RunnableToolFunctionWithParse } from 'openai/lib/RunnableFunction';
import { z, ZodSchema } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { bundle, compile } from '#/compiler';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY!,
  // baseURL: 'https://api.groq.com/openai/v1',
  // baseURL: 'https://api.deepseek.com',
});

const system_prompt = `\
# Instructions
You are a general purpose AI agent that maximise's user productivity using agentic actions.
You will be given a user message and the ability to generate agentic apps with svelte.
Apps are rendered inline chat.
Do not hallucinate.
Do not repeat yourself.
Do not mention that you are using svelte/code generation as this is a implementation detail hidden to the user.
Please provide only the rendered components without repeating the code in the chat.
Ensure you declare all variables that you will bind to the UI elements in <script> via $state(value) i.e. let value = $state(3);
Make sure the script tag always comes before the UI.
Use svelte 5 runes syntax: $state(), $effect(() => ...) $derived(...) $derived.by(() => ...)
To get a dom reference in svelte you can use <div bind:this={domRef} /> make sure the reference is a reactive state i.e. let domrRef = $state(null);
Do not reference a DOM reference outside of mount as it will be null i.e. onMount(() => {
  domRef.innerContent = 'hello world';
});
$state() creates a deeply reactive store, you can mutate it like a normal variable and it will automatically update the DOM i.e.
let x = $state({ x: 5, y: [1, 2, 3, 4 ]});
x.x = 6 // generates reactive update
x.y.push(3) // generates reactive update
Never use $state() outside the <script> top level let variable declarations.
Do not use $state() if you do not need svelte-reactivity.
Do not do this:
let x = ...
x = $state(...);
state runes automatically update when referenced in the dom i.e. given the state let x = $state(5) we can reference it like so: <div>{x}</div>
For side effects do this:
$effect(() => {
  console.log(x) // this will run everytime x changes
})

# Examples
Here is an exhaustive set of styled components you can use:

# Example 1

<ui.button onclick={...} />

# Example 2

<script>
  let value = $state('');
</script>

<ui.input bind:value />
`;

// tools we need
// search actions
// render action as ui
// evaluate javascript code
// evaluate action and render

const render_code_tool = (stream: StreamingApi) =>
  zodFunction({
    name: 'render-code',
    description:
      'renders an action in chat, taking svelte code as input, allowing you to generate an action on the fly',
    schema: z.object({
      code: z.string(),
      // props: z.optional(z.record(z.any())),
    }),
    async function(args) {
      const compiled = await bundle(null, compile(args.code));
      await stream.writeln(
        JSON.stringify({ type: 'render', content: compiled }),
      );
      return { result: 'ui rendered successfully' };
    },
  });

export const ai_controller = new Hono()
  .post('/chat', async (c) => {
    const { messages } = await c.req.json<{
      messages: ChatCompletionMessage[];
    }>();
    const chat_stream = await openai.chat.completions.create({
      messages: messages,
      model: 'o3-mini',
      stream: true,
    });
    return streamText(c, async (stream) => {
      stream.onAbort(chat_stream.controller.abort);
      for await (const chunk of chat_stream) {
        const text = chunk.choices[0]?.delta.content ?? '';
        stream.writeln(text);
      }
    });
  })
  .post('/agent', async (c) => {
    let { messages } = await c.req.json<{
      messages: ChatCompletionMessageParam[];
    }>();
    messages = [{ role: 'system', content: system_prompt }, ...messages];
    return streamText(c, async (stream) => {
      const runner = openai.beta.chat.completions
        .runTools({
          stream: true,
          model: 'gpt-4o-mini',
          tools: [render_code_tool(stream)],
          messages,
        })
        .on('content', async (delta) => {
          await stream.writeln(
            JSON.stringify({ type: 'text', content: delta }),
          );
        });
      await runner.finalChatCompletion();
    });
  });

function zodFunction<T extends object>({
  function: fn,
  schema,
  description = '',
  name,
}: {
  function: (args: T) => Promise<object>;
  schema: ZodSchema<T>;
  description?: string;
  name?: string;
}): RunnableToolFunctionWithParse<T> {
  return {
    type: 'function',
    function: {
      function: fn,
      name: name ?? fn.name,
      description: description,
      parameters: zodToJsonSchema(schema) as JSONSchema,
      parse(input: string): T {
        const obj = JSON.parse(input);
        return schema.parse(obj);
      },
    },
  };
}
