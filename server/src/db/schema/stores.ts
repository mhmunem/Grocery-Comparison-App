import { serial, integer, text, pgTable } from "drizzle-orm/pg-core";
import { chains } from './chains';

export const stores = pgTable('stores', {
    id: serial().primaryKey(),
    locationName: text().notNull(),
    chainID: integer().notNull().references(() => chains.id),
})
