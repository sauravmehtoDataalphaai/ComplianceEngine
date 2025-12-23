import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Make database optional in development mode
if (!process.env.DATABASE_URL) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
  // In development, create a dummy pool that won't be used
  console.warn("⚠️  DATABASE_URL not set. Database features will be unavailable.");
}

export const pool = process.env.DATABASE_URL 
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : (null as any);

export const db = process.env.DATABASE_URL
  ? drizzle(pool as pg.Pool, { schema })
  : (null as any);
