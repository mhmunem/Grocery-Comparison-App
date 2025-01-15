import { serial, date, integer, pgTable } from "drizzle-orm/pg-core";
import { numericCasted } from "../../types/types";
import { products } from "./products";

export const price_history = pgTable('price_history', {
    id: serial().primaryKey(),
    date: date().notNull(),
    price: numericCasted().notNull(),
    productID: integer().notNull().references(() => products.id)
    
})
