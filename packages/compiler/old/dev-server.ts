import type { ServerWebSocket } from 'bun'
import { watch } from 'fs';
import { Hono } from 'hono';
import { WSContext } from 'hono/ws';
import { createBunWebSocket } from 'hono/bun'
import { init_db } from '#/db/local/init-node';
import { bundle } from './bundle';
import { compile } from './compile';

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

async function bundle_and_compile_file(db: any, filepath: string) {
  const file = Bun.file(filepath);
  const code = await file.text();
  return bundle(db, compile(code));
}

export async function dev_server(filepath: string) {
  const db = await init_db('');
  const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>();
  const clients = new Set<WSContext<ServerWebSocket<undefined>>>();
  
  watch(filepath, (event) => {
    if (event === 'change') {
      console.log('refreshing changes');
      clients.forEach((ws) => {
        ws.send('')
      })
    }
  });

  const app = new Hono();

  app.get('/', async (ctx) => {
    const code = await bundle_and_compile_file(db.orm, filepath);
    return ctx.html(base_html_template(code));
  })

  app.get('/ws', upgradeWebSocket(() => {
    return {
      onOpen(_, ws) {
        clients.add(ws); 
      },
      onClose(_, ws) {
        clients.delete(ws); 
      }
    }
  }));

  console.log('starting dev server at http://localhost:3000');

  Bun.serve({
    port: 3000,
    fetch: app.fetch,
    websocket,
  })
}
