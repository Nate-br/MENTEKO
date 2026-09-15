import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Scenario } from '../models/Scenario';
import { scenarioSeedData } from './scenarioSeedData';

async function seed(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set. Add it to backend/.env before seeding.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('[seed] Connected to MongoDB');

  await Scenario.deleteMany({});
  console.log('[seed] Cleared existing scenarios');

  const created = await Scenario.insertMany(scenarioSeedData);
  console.log(`[seed] Inserted ${created.length} scenarios`);

  await mongoose.disconnect();
  console.log('[seed] Done');
}

seed().catch((error) => {
  console.error('[seed] Failed:', error);
  process.exit(1);
});
