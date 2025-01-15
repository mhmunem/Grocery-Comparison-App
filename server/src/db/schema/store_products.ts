import { products } from "./products";
import { serial, integer, pgTable } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { numericCasted } from "../../types/schema";

export const store_products = pgTable('store_products', {
    id: serial().primaryKey(),
    storeID: integer().notNull().references(() => stores.id),
    productID: integer().notNull().references(() => products.id),
    price: numericCasted().notNull(),
})
