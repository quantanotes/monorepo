import fs from 'fs/promises';
import { readMigrationFiles } from 'drizzle-orm/migrator';
const folder = './migrations';
const file = `${folder}/export.json`;
const allMigrations = readMigrationFiles({ migrationsFolder: folder });
await fs.writeFile(`${file}`, JSON.stringify(allMigrations, null, 2), {
  flag: 'w',
});
