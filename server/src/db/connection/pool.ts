import { Pool } from 'pg'
import { chains } from '../schema/chains'
import { drizzle } from 'drizzle-orm/node-postgres'
import { products } from '../schema/products'
import { seed_db, reset_db } from '../seed/seed'
import { shopping_list } from '../schema/shopping_list'
import { store_products } from '../schema/store_products'
import { stores } from '../schema/stores'
import { units } from '../schema/units'
import { category } from '../schema/category'
import { price_history } from '../schema/price_history'


const env = process.env.NODE_ENV!

console.log("Running in environment:", env)

const dbUrl = process.env[`${env.toUpperCase()}_DATABASE_URL`]

const databases = ['cosc680_dev_db', 'cosc680_test_db', 'cosc680_prod_db']

const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT!),
}

const pool = new Pool(config)

const createDatabases = async () => {
    for (const dbName of databases) {
        try {
            const query = `SELECT 1 FROM pg_database WHERE datname = $1 LIMIT 1`
            const res = await pool.query(query, [dbName])
            if (res.rowCount === 0) {
                await pool.query(`CREATE DATABASE ${dbName}`)
                console.log(`Database ${dbName} created successfully.`)
            } else {
                console.log(`Database ${dbName} already exists.`)
            }
        } catch (error) {
            console.error(`Error while creating database ${dbName}:`, error)
        }
    }
}

createDatabases()

const finalPool = new Pool({
    connectionString: dbUrl
})

const db = drizzle(finalPool)

// reset_db(db, { products, stores, store_products, chains, units, shopping_list, category, price_history })
seed_db(db, { products, stores, store_products, chains, units, shopping_list, category, price_history })




export default db
