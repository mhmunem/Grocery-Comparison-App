import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { ilike, asc, desc } from "drizzle-orm";
import { products } from "../db/schema/products";


export async function search_product(db: NodePgDatabase, user_query: string, sort_by: 'name' | 'price' | 'amount', sort_direction: 'ASC' | 'DESC') {
    const sort = sort_direction == 'ASC' ? asc : desc
    let column

    switch (sort_by) {
        case 'name':
            column = products.name
            break;
        case 'price':
            column = products.price
            break;
        default:
            column = products.amount
            break;
    }

    const search_results = await db
        .select()
        .from(products)
        .where(ilike(products.name, `%${user_query}%`))
        .orderBy(sort(column))

    return search_results
}
