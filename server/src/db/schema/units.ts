import { serial, text, pgTable, unique } from "drizzle-orm/pg-core";

export const units = pgTable('units', {
    id: serial().primaryKey(),
    name: text().notNull().unique(),
});
