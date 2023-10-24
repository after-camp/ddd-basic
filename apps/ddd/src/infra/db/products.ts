import {
  integer,
  pgTable,
  serial,
  varchar,
  time,
  timestamp,
} from "drizzle-orm/pg-core";
import { brandTable } from "./brands";
import { categoryTable } from "./categories";

export const productTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name"),
  price: integer("price"),
  stock: integer("stock"),
  brandId: integer("brand_id").references(() => brandTable.id).notNull(),
  categoryId: integer("category_id").references(() => categoryTable.id).notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
  }).defaultNow(),
});
