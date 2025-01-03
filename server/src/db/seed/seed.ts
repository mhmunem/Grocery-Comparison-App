import { NodePgDatabase } from "drizzle-orm/node-postgres"
import { seed } from "drizzle-seed"

export async function seed_db(db: NodePgDatabase, tables: Object) {
    try {
        await seed(db, tables).refine(f => ({
            products: {
                count: 10000,
                columns: {
                    price: f.number({
                        minValue: 1,
                        maxValue: 15,
                    }),
                    amount: f.int({
                        minValue: 100,
                        maxValue: 500,
                    }),
                },
            },
            stores: {
                count: 30,
            },
            chains: {
                count: 5,
            },
            store_products: {
                count: 1000,
            },
            units: {
                count: 3
            },
            shopping_list: {
                count: 10,
            },
        }))
    } catch (error) {
        console.error("WARNING: found deplicate keys while trying to seed the database. Remove the duplicate keys first. You can reset the database with `reset()` from drizzle-seed.");
    }
}
