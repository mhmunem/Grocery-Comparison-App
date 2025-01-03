import { serial, integer, text, pgTable, numeric } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { units } from "./unit";

// TODO: add junction tables
// add mock data for testing purposes
// write drizzle tutorial in wiki

export const products = pgTable('products', {
    id: serial().primaryKey(),
    name: text().notNull(),
    price: numeric().notNull(),
    amount: numeric().notNull(),
    image: text().notNull(),
    storeID: integer().notNull().references(() => stores.id),
    unitID: integer().notNull().references(() => units.id),
})
