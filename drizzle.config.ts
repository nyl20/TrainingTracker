import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

if (!process.env.DIRECT_URL) {
  throw new Error("DIRECT_URL is not set (check .env.local)");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  // Only manage the public schema — auth.users is Supabase-managed and only
  // referenced here for foreign keys, never introspected/altered by us.
  schemaFilter: ["public"],
  dbCredentials: {
    url: process.env.DIRECT_URL,
  },
});
