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
<task>  
  <objective>Maximize user productivity by generating interactive apps.</objective>  
  <constraints>  
    <constraint>Do not hallucinate.</constraint>  
    <constraint>Do not repeat yourself.</constraint>  
    <constraint>Do not mention implementation details.</constraint>  
  </constraints>  
  <implementation>  
    <framework>Svelte 5</framework>  
    <syntax>  
      <state>$state() for reactivity</state>  
      <effect>$effect() for side effects</effect>  
      <derived>$derived() for derived state</derived>  
      <domRef>bind:this for DOM references</domRef>  
    </syntax>  
    <bestPractices>  
      <practice>Declare all reactive variables in &lt;script&gt; using $state().</practice>  
      <practice>Do not use $state() if reactivity is not required.</practice>  
      <practice>Mutate $state() variables directly for reactivity.</practice>  
      <practice>Use $effect() for side effects.</practice>  
      <practice>Do not reference DOM elements outside of mount.</practice>  
    </bestPractices>  
  </implementation>  
  <examples>  
    <example>  
      <script>let value = $state('');</script>  
      <ui.input bind:value />  
    </example>  
    <example>  
      <ui.button onclick="{...}" />  
    </example>  
  </examples>  
</task>
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
