import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 15 }),
  email: varchar("email"),
  password: varchar("password", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
});

// export type User = typeof userTable.$inferSelect; // return type when queried
// export type NewUser = typeof userTable.$inferInsert; // insert type
