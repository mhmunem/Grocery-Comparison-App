import { serial, integer, text, pgTable, numeric } from "drizzle-orm/pg-core"
import { units } from "./units"
import { category } from "./category"

export const products = pgTable('products', {
    id: serial().primaryKey(),
    name: text().notNull(),
    brand: text().notNull(),
    details: text().notNull(),
    amount: numeric().notNull(),
    image: text().notNull(),
    unitID: integer().notNull().references(() => units.id),
    categoryID: integer().references(() => category.id),
})
