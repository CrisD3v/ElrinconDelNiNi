import 'dotenv/config';
import '../src/polyfill.js';
import postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from './schema';
import contractJson from './schema.json' with { type: 'json' };

export const db = postgres<Contract>({
  contractJson,
  url: process.env['DATABASE_URL'],
});
