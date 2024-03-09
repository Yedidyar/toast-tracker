import type { Config } from "drizzle-kit";
import { env } from "~/env/server.mjs";

export default {
  driver: "mysql2",
  out: "./src/drizzle/migrations",

  schema: ["./src/drizzle/schema.ts"],
  dbCredentials: {
    uri: env.DATABASE_URL,
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
} satisfies Config;
