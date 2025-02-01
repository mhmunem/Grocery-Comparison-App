import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Chains } from "../types/schema";
import { chains } from "../db/schema/chains";
import { Stores } from "../types/schema";
import { stores } from "../db/schema/stores";
import { inArray } from "drizzle-orm";

const storeIds = [2, 5, 6, 10, 15, 28, 30, 32, 38, 41,
    58, 64, 73, 90, 99, 104, 129, 134, 141, 158,
    162, 163, 173, 186, 192, 195, 197, 207, 208, 211,
    212, 217, 221, 234, 246, 249, 266, 267, 275, 283,
    286, 288, 296, 333, 336, 339, 344, 357, 361, 367,
    384, 398, 403, 409, 417, 422, 423, 434]; 

const chainIds=[1,2,3,5];
export async function get_chain(db: NodePgDatabase): Promise<Chains[]> {
    return await db
        .select()
        .from(chains)
        .where(inArray(chains.id,chainIds))

}

export async function get_stores(db: NodePgDatabase): Promise<Stores[]> {
    return await db
        .select()
        .from(stores)
        .where(inArray(stores.id, storeIds))
}
