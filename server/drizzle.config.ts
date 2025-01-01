import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema/*',
  dbCredentials: {
    url: 'postgresql://postgres:cosc680@localhost:5432/postgres',
  },
  out: "./drizzle",
})
