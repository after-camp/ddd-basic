import { boolean, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const categoryTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name"),
  display: boolean("display"),
});
