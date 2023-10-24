import { real, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const brandTable = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: varchar("name"),
  commision: real("commision"),
  registrationNumber: varchar("company_registration_number"),
});
