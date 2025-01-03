import { serial, integer, pgTable, numeric } from "drizzle-orm/pg-core";
import { products } from "./products";

export const shopping_list = pgTable('shopping_list', {
    id: serial().primaryKey(),
    amount: numeric().notNull(),
    productID: integer().notNull().references(() => products.id),
})
