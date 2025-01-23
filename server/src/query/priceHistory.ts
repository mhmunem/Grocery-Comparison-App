import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PriceHistory } from "../types/schema";
import { eq } from "drizzle-orm";
import { price_history } from "../db/schema/price_history";

export async function get_price_history_product(db: NodePgDatabase, product_id: number): Promise<PriceHistory[]> {
    return await db
        .select()
        .from(price_history)
        .limit(10)
        .where(eq(price_history.productID, product_id))
}
