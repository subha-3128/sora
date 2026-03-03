import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

// Use Supabase PostgreSQL via DATABASE_URL (from Supabase project settings)
const databaseUrl = process.env.DATABASE_URL;

// Defer connection check to runtime
let db: any = null;

function initializeDatabase() {
  if (db) return db;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required. Set it to your Supabase PostgreSQL connection string.\n" +
      "Find it in Supabase Dashboard → Settings → Database → Connection string (URI)."
    );
  }

  console.log("🗄️ Connecting to Supabase PostgreSQL…");

  const { Pool } = pg;
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === "production" ? true : {
      rejectUnauthorized: false,
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool.on("error", (err: Error) => {
    console.error("❌ Unexpected error on idle client", err);
  });

  // Test connection on startup
  pool.query("SELECT NOW()", (err, result) => {
    if (err) {
      console.error("❌ Database connection failed:", err.message);
    } else {
      console.log("✅ Database connected successfully at", result?.rows[0]?.now);
    }
  });

  db = drizzle(pool, { schema });
  return db;
}

export const getDb = () => initializeDatabase();


