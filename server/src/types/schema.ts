import { stores } from "../db/schema/stores";
import { products } from "../db/schema/products";
import { chains } from "../db/schema/chains";
import { units } from "../db/schema/units";
import { store_products } from "../db/schema/store_products";
import { customType } from "drizzle-orm/pg-core";

export type Products = typeof products.$inferSelect
export type Stores = typeof stores.$inferSelect
export type Chains = typeof chains.$inferSelect
export type Units = typeof units.$inferSelect
export type StoreProducts = typeof store_products.$inferSelect

// A custom type which solves the issue of numeric and decimal types being infered as string.
// See: https://github.com/drizzle-team/drizzle-orm/issues/1042
export const numericCasted = customType<{
    data: number
    driverData: string
}>({
    dataType: () => 'numeric',
    fromDriver: (value: string) => Number.parseFloat(value), // note: precision loss for very large/small digits so area to refactor if needed
    toDriver: (value: number) => value.toString(),
})
