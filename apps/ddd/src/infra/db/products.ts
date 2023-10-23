import {
  integer,
  pgTable,
  serial,
  varchar,
  time,
  timestamp,
} from "drizzle-orm/pg-core";

export const productTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name"),
  price: integer("price"),
  stock: integer("stock"),
  createdAt: timestamp("created_at", {
    mode: "date",
  }).defaultNow(),
});
