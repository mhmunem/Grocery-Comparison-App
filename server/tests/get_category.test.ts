import dotenv from "dotenv"
import express from "express"
import request from "supertest"
import routes from '../src/routes/initialsetup'
import storesRouter from "../src/routes/storesRouter"
import categoryRouter from "../src/routes/categoryRouter"
import { Pool } from "pg"
import { SortBy } from "../src/types/routes"
import { SortDirection } from "../src/types/routes"
import { category } from "../src/db/schema/category"
import { chains } from "../src/db/schema/chains"
import { drizzle } from "drizzle-orm/node-postgres"
import { price_history } from "../src/db/schema/price_history"
import { products } from "../src/db/schema/products"
import { reset, seed } from "drizzle-seed"
import { get_category } from "../src/query/categoryQuery"
// import { search_product } from "../src/search/search"
import { shopping_list } from "../src/db/schema/shopping_list"
import { store_products } from "../src/db/schema/store_products"
import { stores } from "../src/db/schema/stores"
import { units } from "../src/db/schema/units"
import { Server } from "http"


describe('get_category function tests', () => {
    dotenv.config()

    const dbUrl = process.env['TEST_DATABASE_URL']

    const pool = new Pool({
        connectionString: dbUrl
    })

    const db = drizzle(pool)
    const schema = { products, stores, store_products, chains, units, shopping_list, category, price_history }

    beforeAll(async () => {
        await reset(db, schema)
        await seed(db, schema, { seed: 42 }).refine(f => ({
            category: {
                count: 3,
                columns: {
                    name: f.valuesFromArray({
                        values: [
                            "category",
                        ],
                    }),
                },
            },
            
        }))
    })

    afterAll(async () => {
        await reset(db, schema)
        await pool.end()
    })

    const results =  [
          { id: 1, name: 'category' },
          { id: 2, name: 'category' },
          { id: 3, name: 'category' }
    ]

    test('all results', async () => {
        return await get_category(db).then(data => {
            expect(data).toEqual(results)
        })
    })

})


