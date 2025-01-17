import app from './app'
import db from "./db/connection/pool"
import { category } from './db/schema/category'
import { chains } from './db/schema/chains'
import { price_history } from './db/schema/price_history'
import { products } from './db/schema/products'
import { reset_db, seed_db } from './db/seed/seed'
import { shopping_list } from './db/schema/shopping_list'
import { store_products } from './db/schema/store_products'
import { stores } from './db/schema/stores'
import { units } from './db/schema/units'

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

const arg = process.argv.slice(2)[0]
const env = process.env.NODE_ENV

console.log("Running in environment:", env)


// This is to facilitate automating seeding of the dev database using docker compose
if (env === 'dev' && arg === 'reset') {
    reset_db(db, { products, stores, store_products, chains, units, shopping_list, category, price_history }).then(() => {
        console.log(`${env} database reset`)
        process.exit(0)
    })
} else if (env === 'dev' && arg === 'seed') {
    seed_db(db, { products, stores, store_products, chains, units, shopping_list, category, price_history }).then(() => {
        console.log(`${env} database seeded`)
        process.exit(0)
    })
} else {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`)
    })
}
