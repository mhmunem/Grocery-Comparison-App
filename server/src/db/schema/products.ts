import { serial, integer, text, pgTable, numeric, uuid } from "drizzle-orm/pg-core";

export const chains = pgTable('chains', {
  id: serial().primaryKey(),
  name: text().notNull(),
  image_logo: text().notNull(),
})

export const units = pgTable('units', {
  id: serial().primaryKey(),
  name: text().notNull(),
  unit_name: text().notNull(),
})

export const stores = pgTable('stores', {
  id: serial().primaryKey(),
  locationName: text().notNull(),
  chainID: integer().notNull().references(() => chains.id),
})

export const products = pgTable('products', {
  id: serial().primaryKey(),
  name: text().notNull(),
  price: numeric().notNull(),
  amount: numeric().notNull(),
  image: text().notNull(),
  storeID: integer().notNull().references(() => stores.id),
  unitID: integer().notNull().references(() => units.id),
})

export const shopping_list = pgTable('shopping_list', {
  id: serial().primaryKey(),
  amount: numeric().notNull(),
  productID: integer().notNull().references(() => products.id),
})
