import { serial, text, pgTable } from "drizzle-orm/pg-core";

export const category = pgTable('category', {
    id: serial().primaryKey(),
    name: text().notNull(),
})
