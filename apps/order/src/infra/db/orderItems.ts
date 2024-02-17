import { real, pgTable, serial, varchar, integer, uuid } from "drizzle-orm/pg-core";

export const orderItemsTable = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: uuid("order_id").notNull(),
  productId: integer("product_id").notNull(),
  productName: varchar("product_name").notNull(),
  productPrice: real("product_price").notNull(),
  orderState: integer("order_state").notNull().default(0),
});
