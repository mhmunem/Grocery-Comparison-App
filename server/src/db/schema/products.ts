import { serial, integer, text, pgTable, numeric } from "drizzle-orm/pg-core"
import { stores } from "./stores"
import { units } from "./units"
import { category } from "./category"

// TODO: add junction tables

export const products = pgTable('products', {
    id: serial().primaryKey(),
    name: text().notNull(),
    brand: text(),
    details:text(),
    amount: numeric().notNull(),
    image: text(),
    unitID: integer().notNull().references(() => units.id),
    categoryID: integer().references(() => category.id),
})
