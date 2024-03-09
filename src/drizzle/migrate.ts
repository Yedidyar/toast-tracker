import { migrate } from "drizzle-orm/mysql2/migrator";
import { db, poolConnection } from "../server/db";
import { resolve } from "path";
const main = async () => {
  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, {
    migrationsFolder: resolve(__dirname, "./migrations"),
    migrationsTable: "drizzle_migrations",
    migrationsSchema: "migrations",
  });
  // Don't forget to close the connection, otherwise the script will hang
  await poolConnection.end();
};

main().catch((e) => console.log(e));
