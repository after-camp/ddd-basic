import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { Client } from "pg";

const client = new Client({
  host: "127.0.0.1",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "infstyle",
});

async function main() {
  console.log("Running migrations...");
  await client.connect();
  const db = drizzle(client);

  await migrate(db, { migrationsFolder: "drizzle" })
  await client.end();

  console.log("Migrations finished");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(0);
});
