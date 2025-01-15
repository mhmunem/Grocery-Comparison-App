import { serial, text, pgTable, unique } from "drizzle-orm/pg-core";

export const chains = pgTable('chains', {
    id: serial().primaryKey(),
    name: text().notNull().unique(),
    image_logo: text().notNull(),
}, (table) => ({
    nameUnique: unique('name_unique').on(table.name),
}));
