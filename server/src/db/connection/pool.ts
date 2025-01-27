import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'


const config = {
    user: process.env["DB_USER"],
    host: process.env["DB_HOST"],
    database: process.env["DB_NAME"],
    password: process.env["DB_PASSWORD"],
    port: parseInt(process.env["DB_PORT"]!),
}

const pool = new Pool(config)

async function createDatabases(pool: Pool) {
    const databases = ['cosc680_dev_db', 'cosc680_test_db', 'cosc680_prod_db']

    for (const dbName of databases) {
        try {
            const query = `SELECT 1 FROM pg_database WHERE datname = $1 LIMIT 1`
            const res = await pool.query(query, [dbName])
            if (res.rowCount === 0) {
                await pool.query(`CREATE DATABASE ${dbName}`)
            }
            console.log(`${dbName} created`);

        } catch (error) {
            console.error(`Error while creating database ${dbName}:`, error)
        }
    }
}

createDatabases(pool)

const env = process.env["NODE_ENV"]!
const dbUrl = process.env[`${env?.toUpperCase()}_DATABASE_URL`]

const finalPool = new Pool({
    connectionString: dbUrl
})

const db = drizzle(finalPool)

export default db
