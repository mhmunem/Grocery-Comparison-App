import { serial, integer, pgTable } from "drizzle-orm/pg-core";
import { products } from "./products";
import { stores } from "./stores";

export const store_products = pgTable('store_products', {
    id: serial().primaryKey(),
    storeID: integer().notNull().references(() => stores.id),
    productID: integer().notNull().references(() => products.id),
})
