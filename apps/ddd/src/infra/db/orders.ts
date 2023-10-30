import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orderItemsTable } from "./orderItems";

export const orderTable = pgTable("orders", {
  id: uuid("id").primaryKey(),
  userId: integer("user_id").notNull(),
  receiverName: varchar("receiver_name").notNull(),
  receiverAddress: varchar("receiver_address").notNull(),
  receiverPhone: varchar("receiver_phone").notNull(),
});

export const orderItemsRelation = relations(orderTable, ({ many }) => ({
  orderItems: many(orderItemsTable),
}));
