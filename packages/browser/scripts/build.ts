import { zip } from 'zip-a-folder';
import { resolve } from 'path';

await Bun.build({
  entrypoints: ['./extension/background.ts'],
  outdir: './dist',
  root: './extension',
  target: 'browser',
});

await zip(resolve('./dist'), resolve('./extension.zip'));

export default null;
