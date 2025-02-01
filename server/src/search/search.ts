import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { ilike, asc, desc, eq, gte, and, ne, inArray } from "drizzle-orm";
import { products } from "../db/schema/products";
import { store_products } from "../db/schema/store_products";
import { units } from "../db/schema/units";
import { category } from "../db/schema/category";
import { stores } from "../db/schema/stores";
import { chains } from "../db/schema/chains";
import { ProductSearchResult } from "../types/schema";

export async function search_product(db: NodePgDatabase, name: string, sort_by: 'name' | 'price' | 'amount', sort_direction: 'ASC' | 'DESC'): Promise<ProductSearchResult[]> {
    const sort = sort_direction == 'ASC' ? asc : desc
    let column
    const storeIds = [2, 5, 6, 10, 15, 28, 30, 32, 38, 41,
        58, 64, 73, 90, 99, 104, 129, 134, 141, 158,
        162, 163, 173, 186, 192, 195, 197, 207, 208, 211,
        212, 217, 221, 234, 246, 249, 266, 267, 275, 283,
        286, 288, 296, 333, 336, 339, 344, 357, 361, 367,
        384, 398, 403, 409, 417, 422, 423, 434];

    switch (sort_by) {
        case 'name':
            column = products.name
            break;
        case 'amount':
            column = products.amount
            break;
        default:
            column = store_products.price
            break;
    }

    const search_results = await db
        .select()
        .from(products)
        .where(and(ilike(products.name, `%${name}%`), inArray(store_products.storeID, storeIds)))
        .innerJoin(store_products,  and(eq(products.id, store_products.productID), ne(store_products.price, 0)))
        .innerJoin(units, eq(products.unitID, units.id))
        .innerJoin(category, eq(products.categoryID, category.id))
        .innerJoin(stores, eq(store_products.storeID, stores.id))
        .innerJoin(chains, eq(chains.id, stores.chainID))
        .orderBy(sort(column))

    return search_results
}
