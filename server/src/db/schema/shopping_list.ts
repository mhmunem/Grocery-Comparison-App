import { products } from "./products";
import { serial, integer, pgTable, numeric } from "drizzle-orm/pg-core";

export const shopping_list = pgTable('shopping_list', {
    id: serial().primaryKey(),
    amount: numeric().notNull(),
    productID: integer().notNull().references(() => products.id),
})
