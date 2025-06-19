import { defineConfig } from 'drizzle-kit';
import drizzleConfig from './drizzle.config';

export default defineConfig({
  ...drizzleConfig,
  schema: `./src/local/schema.ts`,
  out: `./src/local/migrations`,
  verbose: true,
});
