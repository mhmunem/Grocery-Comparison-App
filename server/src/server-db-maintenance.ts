import { createDatabases, dropDB, pool } from "./db/connection/pool-maintenance"

const arg = process.argv[2]
const env = process.env["NODE_ENV"]

console.log("Running in environment:", env)

// This is to facilitate automating seeding of the dev database using docker compose
// It allows seeding and resetting to be done indepently using packacke.json script.
// This prevents race conditions when resestting and seeding the database in the same instance.
if (env === "prod" && arg === "drop") {
    dropDB(pool)
} else if (arg === "create") {
    createDatabases(pool)
} else {
    console.log("No commands given");

}
