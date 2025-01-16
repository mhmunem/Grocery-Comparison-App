import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { chains } from "../db/schema/chains";
import { stores } from "../db/schema/stores";


export async function get_chain(db: NodePgDatabase) {
    const chain_results = await db
        .select()
        .from(chains)
    return chain_results
}

export async function get_stores(db: NodePgDatabase) {
    const stores_results = await db
        .select()
        .from(stores)
    return stores_results
}