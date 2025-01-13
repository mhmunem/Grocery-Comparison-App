import { serial, text, pgTable } from "drizzle-orm/pg-core";

export const chains = pgTable('chains', {
    id: serial().primaryKey(),
    name: text().notNull(),
    image_logo: text().notNull(),
})
