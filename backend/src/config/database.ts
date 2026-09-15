import mongoose from 'mongoose';

/**
 * Connects to MongoDB using MONGODB_URI. The server is designed to start and
 * serve routes even if this connection fails or is not configured — scenario
 * data has a frontend-side seed fallback, so local development doesn't hard
 * depend on a live database.
 */
export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[db] MONGODB_URI not set — skipping database connection.');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('[db] Connected to MongoDB');
  } catch (error) {
    console.error('[db] Failed to connect to MongoDB:', (error as Error).message);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected');
  });
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
