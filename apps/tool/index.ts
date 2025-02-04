import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { dev_server } from '#/compile';
import { client } from '@/api';

yargs(hideBin(process.argv)).command(
  "run <file>",
  "Runs an action",
  (yargs) => {
    yargs.positional('file', {
      describe: 'Action file to run',
      type: 'string',
    });
  },
  async ({ file }) => {
    await dev_server(file as string);
  },
).command(
  "push <file>",
  "Deploys an action to the action space",
  (yargs) => {
    yargs.positional('file', {
      describe: 'Action file to deploy',
      type: 'string',
    });
  },
  async (argv) => {
      const filename = argv.file as string;
      const file = Bun.file(filename);
      const code = await file.text();
      const name = filename.slice(0, (filename.lastIndexOf('.')));
      client.push.$post({ json: { name, code }  })
  },
).parse()
