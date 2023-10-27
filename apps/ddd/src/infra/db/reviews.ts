import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { productTable } from "./products";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const reviewTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => productTable.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  rating: integer("rating"),
  comment: varchar("comment", { length: 500 }),
});

export const productTableRelation = relations(reviewTable, ({ one }) => ({
  product: one(productTable, {
    fields: [reviewTable.productId],
    references: [productTable.id],
  }),
}));
