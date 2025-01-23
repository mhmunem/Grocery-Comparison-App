import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PriceHistory } from "../types/schema";
import { eq, asc } from "drizzle-orm";
import { price_history } from "../db/schema/price_history";

export async function get_price_history_product(db: NodePgDatabase, product_id: number, past_n_days: number): Promise<PriceHistory[]> {
    return await db
        .select()
        .from(price_history)
        .limit(past_n_days)
        .where(eq(price_history.productID, product_id))
        .orderBy(asc(price_history.date))
}
