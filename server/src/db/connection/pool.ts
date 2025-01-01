import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({
  path: '.env'
});

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
};  

const pool = new Pool(config);
const db = drizzle(pool);

pool.connect()
  .then(() => {
    console.log('Connected to the database');
    return db.execute('SELECT NOW()');
  })
  .then((result) => {
    console.log('Database connection check successful:', result);
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

export default db;
