import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { categoryTable } from "./categories";
import { relations } from "drizzle-orm";
import { reviewTable } from "./reviews";

export const productTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name"),
  price: integer("price"),
  stock: integer("stock"),
  brandId: integer("brand_id").notNull(),
  categoryId: integer("category_id")
    .references(() => categoryTable.id)
    .notNull(),
  isTopRated: boolean("is_top_rated").default(false),
  createdAt: timestamp("created_at", {
    mode: "date",
  }).defaultNow(),
});

export const reviewsRelation = relations(productTable, ({ many }) => ({
  reviews: many(reviewTable),
}));
