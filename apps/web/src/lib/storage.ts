import { S3Client } from 'bun';

export const storage = new S3Client({
  region: 'auto',
  endpoint: process.env.STORAGE_URL,
  accessKeyId: '',
  secretAccessKey: '',
});
