import { Pool } from "pg";

export const dbPool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "infstyle",
});
