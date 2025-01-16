import dotenv from "dotenv"
import { Pool } from "pg";
import { SortBy } from "../src/types/routes";
import { SortDirection } from "../src/types/routes";
import { category } from "../src/db/schema/category";
import { chains } from "../src/db/schema/chains";
import { drizzle } from "drizzle-orm/node-postgres";
import { price_history } from "../src/db/schema/price_history";
import { products } from "../src/db/schema/products";
import { search_product } from "../src/search/search";
import { shopping_list } from "../src/db/schema/shopping_list";
import { store_products } from "../src/db/schema/store_products";
import { stores } from "../src/db/schema/stores";
import { units } from "../src/db/schema/units";
import { reset, seed } from "drizzle-seed";


dotenv.config()

const dbUrl = process.env['TEST_DATABASE_URL']

const pool = new Pool({
    connectionString: dbUrl
})

const db = drizzle(pool)
const schema = { products, stores, store_products, chains, units, shopping_list, category, price_history }

describe('search_product', () => {
    beforeEach(async () => {
        await seed(db, schema, { seed: 42 }).refine(f => ({
            products: {
                count: 5,
                columns: {
                    brand: f.valuesFromArray({
                        values: [
                            "Value"
                        ],
                    }),
                    details: f.valuesFromArray({
                        values: [
                            "description 1",
                        ],
                    }),
                    amount: f.number({
                        minValue: 1,
                        precision: 100,
                        maxValue: 10,
                    }),
                    name: f.valuesFromArray({
                        values: [
                            "Organic Bananas", "Whole Milk", "Large Brown Eggs", "Wheat Bread", "Ground Coffee",
                        ],
                        isUnique: true,
                    }),
                },
            },
            stores: {
                count: 1,
                columns: {
                    name: f.valuesFromArray({
                        values: [
                            "store 1"
                        ],
                    }),
                },
            },
            chains: {
                count: 1,
                columns: {
                    name: f.valuesFromArray({
                        values: [
                            "chain 1",
                        ],
                    }),
                },
            },
            store_products: {
                count: 1,
                columns: {
                    price: f.number({
                        minValue: 1,
                        precision: 100,
                        maxValue: 20,
                    }),
                },
            },
            category: {
                count: 1,
                columns: {
                    name: f.valuesFromArray({
                        values: [
                            "category 1",
                        ],
                    }),
                },
            },
            units: {
                count: 1,
                columns: {
                    name: f.valuesFromArray({
                        values: [
                            "kg",
                        ],
                    }),
                },
            },
            price_history: {
                count: 0,
                columns: {
                    date: f.date({
                        minDate: "2025-01-01",
                        maxDate: "2025-01-01",
                    }),
                    price: f.number({
                        minValue: 1,
                        precision: 100,
                        maxValue: 1000,
                    }),
                },
            },
        }))
    });

    afterEach(async () => {
        reset(db, schema)
    });

    test('test caseinsensitive', async () => {
        return await search_product(db, 'MILK', 'price' as SortBy, 'ASC' as SortDirection).then(data => {
            expect(data).toStrictEqual([{ "products": { "amount": 1.55, "brand": "Value", "categoryID": 1, "details": "description 1", "id": 5, "image": "LB6EInJgCGsW", "name": "Whole Milk", "unitID": 1 }, "store_products": { "id": 1, "price": 12.24, "productID": 5, "storeID": 1 } }]);
        })
    });
})
