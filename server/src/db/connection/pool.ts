import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
};

const pool = new Pool(config);
const db = drizzle(pool);

export default db;
