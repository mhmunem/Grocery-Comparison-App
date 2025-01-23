import app from "./app"
import db from "./db/connection/pool"
import seed_data_dev from "./db/seed/seed_data_dev"
import seed_data_e2e_tests from "./db/seed/seed_data_e2e_tests"
import { category } from "./db/schema/category"
import { chains } from "./db/schema/chains"
import { price_history } from "./db/schema/price_history"
import { products } from "./db/schema/products"
import { reset_db, seed_db } from "./db/seed/seed"
import { shopping_list } from "./db/schema/shopping_list"
import { store_products } from "./db/schema/store_products"
import { stores } from "./db/schema/stores"
import { units } from "./db/schema/units"

const PORT: number = process.env["PORT"] ? parseInt(process.env["PORT"], 10) : 3000

const arg = process.argv[2]
const env = process.env["NODE_ENV"]

console.log("Running in environment:", env)

let seed_data
switch (env) {
    case "test":
        seed_data = seed_data_e2e_tests
        break
    default: // dev
        seed_data = seed_data_dev
        break
}

// This is to facilitate automating seeding of the dev database using docker compose
// It allows seeding and resetting to be done indepently using packacke.json script.
// This prevents race conditions when resestting and seeding the database in the same instance.
if (env !== "prod" && arg === "reset") {
    console.log(`Resetting ${env} database`)
    reset_db(db, { products, stores, store_products, chains, units, shopping_list, category, price_history }).then(() => {
        console.log(`${env} database reset`)
        process.exit(0)
    })
} else if (env !== "prod" && arg === "seed") {
    console.log(`Seeding ${env} database`)
    seed_db(db, { products, stores, store_products, chains, units, shopping_list, category, price_history }, seed_data).then(() => {
        console.log(`${env} database seeded`)
        process.exit(0)
    })
} else {
    let server = app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server is running on port ${PORT}`)
    })

    process.on("SIGTERM", () => {
        console.log("SIGTERM signal received: closing HTTP server")
        server.close(() => {
            console.log("HTTP server closed")
        })
    })
}
