import type { ServerWebSocket } from 'bun';
import { watch } from 'fs';
import * as path from 'path';
import { Hono } from 'hono';
import { WSContext } from 'hono/ws';
import { createBunWebSocket } from 'hono/bun';
import * as svelte_compiler from 'svelte/compiler';
import { rollup } from 'rollup';
import virtual from '@rollup/plugin-virtual';
import alias from '@rollup/plugin-alias';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import tailwindcss_postcss from '@tailwindcss/postcss';

export function compile(code: string) {
  const { js } = svelte_compiler.compile(code, { generate: 'client' });
  return js.code;
}

export async function bundle(db: any, code: string) {
  const bundle = await rollup({
    input: 'entry',
    plugins: [virtual({ entry: code })],
    onwarn(warning, warn) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        return;
      } else {
        warn(warning);
      }
    },
  });

  const { output } = await bundle.generate({
    format: 'iife',
    sourcemap: false,
  });

  return output[0].code;
}

export async function dev_server(db: any, filepath: string) {
  const base_html_template = (code: string) => `
    <!DOCTYPE html>
    <html class="dark" lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <title>Quanta Action Dev Server</title>
      </head>
      <body>
        <div id="app"></div>
        <script type="module">
          ${code}
        </script>
        <script>
          const ws = new WebSocket('ws://localhost:3000/ws');
          ws.onmessage = (message) => {
            window.location.reload()
          };
        </script>
      </body>
    </html>
  `;

  const virtual_entry = `
    import { mount } from 'svelte';
    import Component from 'component.svelte';
    import ai from 'ai';
    import ui from 'ui';
    import 'styles';
    mount(Component, { target: document.querySelector('#app') });
  `;

  async function bundle_and_compile_file() {
    const file = Bun.file(filepath);
    const code = await file.text();
    const compiled = compile(code);
    const bundle = await rollup({
      input: 'entry',
      plugins: [
        alias({
          entries: {
            '#/*': path.resolve(__dirname, '../'),
            '@/*': path.resolve(__dirname, '../../apps/'),
            styles: path.resolve(__dirname, '../ui/styles.css'),
            ai: path.resolve(__dirname, '../runtime/ai.ts'),
            ui: path.resolve(__dirname, '../runtime/ui.ts'),
          },
        }),
        virtual({ entry: virtual_entry, 'component.svelte': compiled }),
        typescript(),
        svelte(),
        postcss({ plugins: [tailwindcss_postcss()] }),
        resolve({ browser: true, dedupe: ['svelte'] }),
      ],
      onwarn(warning, warn) {
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
          return;
        } else {
          warn(warning);
        }
      },
    });

    const { output } = await bundle.generate({
      format: 'esm',
      sourcemap: false,
    });

    return output[0].code;
  }

  const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>();
  const clients = new Set<WSContext<ServerWebSocket<undefined>>>();

  watch(filepath, (event) => {
    if (event === 'change') {
      console.log('refreshing changes');
      clients.forEach((ws) => {
        ws.send('');
      });
    }
  });

  const app = new Hono();

  app.get('/', async (ctx) => {
    const code = await bundle_and_compile_file();
    return ctx.html(base_html_template(code));
  });

  app.get(
    '/ws',
    upgradeWebSocket(() => {
      return {
        onOpen(_, ws) {
          clients.add(ws);
        },
        onClose(_, ws) {
          clients.delete(ws);
        },
      };
    }),
  );

  console.log('starting dev server at http://localhost:3000');

  Bun.serve({
    port: 3000,
    fetch: app.fetch,
    websocket,
  });
}
