import { chains } from './chains';
import { serial, integer, text, pgTable } from "drizzle-orm/pg-core";


export const stores = pgTable('stores', {
    id: serial().primaryKey(),
    locationName: text().notNull(),
    chainID: integer().notNull().references(() => chains.id),
})
