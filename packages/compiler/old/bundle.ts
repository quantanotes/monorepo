import * as path from 'path';
import { rollup } from 'rollup';
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import typescript from '@rollup/plugin-typescript';
import virtual from '@rollup/plugin-virtual';
import postcss from 'rollup-plugin-postcss';
import tailwindcss_postcss from '@tailwindcss/postcss';

const virtual_entry = `
  import { mount } from 'svelte';
  import Component from 'component.svelte';
  import 'styles';
  mount(Component, { target: document.querySelector('#app') });
`;

export async function bundle(db: any, code: string): Promise<string> {
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
      virtual({ entry: virtual_entry, 'component.svelte': code }),
      typescript(),
      svelte(),
      postcss({ plugins: [tailwindcss_postcss()] }),
      resolve({ browser: true, dedupe: ['svelte'] }),
      db_resolver(db),
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

//import { BunPlugin } from 'bun';
//import { eq } from 'drizzle-orm';
//import { schema } from '#/db/local';

//function virtual(
//  virtuals: Record<string, string | Record<string, unknown>>,
//): BunPlugin {
//  return {
//    name: 'virtual-js',
//    setup(build) {
//      Object.entries(virtuals).forEach(([key, value]) => {
//        build.module(key, () => {
//          if (typeof value === 'object') {
//            return {
//              loader: 'object',
//              exports: value,
//            };
//          } else if (typeof value === 'string') {
//            return {
//              loader: 'js',
//              contents: value,
//            };
//          }
//        });
//      });
//    },
//  };
//}
//
//function svelte(): BunPlugin {
//  return {
//    name: 'svelte',
//    async setup(build) {
//      const { compile } = await import('svelte/compiler');
//      build.onLoad({ filter: /\.svelte$/ }, async ({ path }) => {
//        const file = await Bun.file(path).text();
//        const contents = compile(file, {
//          filename: path,
//          generate: 'client',
//        }).js.code;
//        return {
//          contents,
//          loader: 'js',
//        };
//      });
//    },
//  };
//}
//
//function db_resolver(db: any): BunPlugin {
//  return {
//    name: 'db-resolver',
//    setup(build) {
//      build.onLoad({ filter: /^(node_modules|monorepo)/ }, async ({ path }) => {
//        const results = await db
//          .select({
//            executable: schema.actions.executable,
//          })
//          .from(schema.actions)
//          .where(eq(schema.actions.name, path));
//        const executable = results[0]?.executable ?? null;
//        return {
//          loader: 'js',
//          contents: executable,
//        };
//      });
//    },
//  };
//}
//
//export async function bundle(db: any, code: string) {
//  const output = await Bun.build({
//    target: 'browser',
//    entrypoints: ['entry'],
//    plugins: [
//      virtual({
//        entry: virtual_entry,
//        component: code,
//      }),
//      svelte(),
//      db_resolver(db),
//    ],
//  });
//  const compiled = output.outputs[0].toString();
//  return compiled;
//}
