import { serial, integer, text, pgTable } from "drizzle-orm/pg-core"
import { units } from "./units"
import { category } from "./category"
import { numericCasted } from "../../types/types"

export const products = pgTable('products', {
    id: serial().primaryKey(),
    name: text().notNull(),
    brand: text().notNull(),
    details: text().notNull(),
    amount: numericCasted().notNull(),
    image: text().notNull(),
    unitID: integer().notNull().references(() => units.id),
    categoryID: integer().notNull().references(() => category.id),
})
