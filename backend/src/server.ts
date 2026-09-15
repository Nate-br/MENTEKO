import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { connectDatabase } from './config/database';

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

async function start(): Promise<void> {
  await connectDatabase();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`[server] MENTEKO API running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('[server] Failed to start:', error);
  process.exit(1);
});
