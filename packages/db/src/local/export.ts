import fs from 'fs/promises';
import { readMigrationFiles } from 'drizzle-orm/migrator';

const folder = './migrations';
const file = `${folder}/export.json`;

const migrations = readMigrationFiles({ migrationsFolder: folder });

const data = JSON.stringify(migrations, null, 2);
const flags = { flag: 'w' };

await fs.writeFile(`${file}`, data, flags);
