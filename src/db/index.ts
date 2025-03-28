import { createClerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL!);

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
);
export const db = drizzle(client);
