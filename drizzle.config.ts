import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './shared/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/parafort_db'
  },
  verbose: true,
  strict: true,
  migrations: {
    prefix: 'timestamp'
  }
} satisfies Config;