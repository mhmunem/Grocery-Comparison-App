import { serial, integer, text, pgTable, numeric } from "drizzle-orm/pg-core"
import { stores } from "./stores"
import { units } from "./unit"

// TODO: add junction tables

export const products = pgTable('products', {
    id: serial().primaryKey(),
    name: text().notNull(),
    brand: text().notNull(),
    amount: numeric().notNull(),
    image: text().notNull(),
    unitID: integer().notNull().references(() => units.id),
})
