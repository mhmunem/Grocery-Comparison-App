import { Pool } from 'pg';
import { chains } from '../schema/chains';
import { drizzle } from 'drizzle-orm/node-postgres';
import { products } from '../schema/products';
import { seed_db } from '../seed/seed';
import { shopping_list } from '../schema/shopping_list';
import { store_products } from '../schema/store_products';
import { stores } from '../schema/stores';
import { units } from '../schema/unit';
import { reset } from 'drizzle-seed';

const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432"),
};

const pool = new Pool(config);
const db = drizzle(pool);

seed_db(db, { products, stores, store_products, chains, units, shopping_list })

export default db;
