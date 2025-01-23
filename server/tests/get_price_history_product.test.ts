import dotenv from "dotenv"
import express from "express"
import request from "supertest"
import routes from '../src/routes/initialsetup'
import storesRouter from "../src/routes/storesRouter"
import { Pool } from "pg"
import { Server } from "http"
import { category } from "../src/db/schema/category"
import { chains } from "../src/db/schema/chains"
import { drizzle } from "drizzle-orm/node-postgres"
import { price_history } from "../src/db/schema/price_history"
import { products } from "../src/db/schema/products"
import { reset, seed } from "drizzle-seed"
import { shopping_list } from "../src/db/schema/shopping_list"
import { store_products } from "../src/db/schema/store_products"
import { stores } from "../src/db/schema/stores"
import { units } from "../src/db/schema/units"
import { get_price_history_product } from "../src/query/priceHistory"
import { sql } from "drizzle-orm"


describe('test get_price_history_product', () => {
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
			price_history: {
				isUnique: true,
				columns: {
					count: 31,
					date: f.date({
						minDate: "2025-01-01",
						maxDate: "2025-01-31",
					}),
					price: f.number({
						minValue: 0.99,
						precision: 2,
						maxValue: 20,
					}),
				},
			},
		}))
	})

	afterAll(async () => {
		await reset(db, schema)
		await pool.end()
	})

	// const results = 

	test('all results', async () => {
		const res = await get_price_history_product(db, 1).then((data: any) => {
			// return await get_price_history_product(db, 1).then((data: any) => {
			expect(true).toStrictEqual(true)
		})
		// console.log(res);

	})
})

// describe('get_price_history_product get endpoint', () => {
//     let server: Server
//
//     beforeAll((done) => {
//         const app = express()
//
//         app.use('/', routes, storesRouter)
//         app.use('/search_product', routes)
//
//         server = app.listen(3000, () => {
//             done();
//         });
//     });
//
//     afterAll((done) => {
//         server.close(() => {
//             done();
//         });
//     });
//
//     const correct_result = [{ "category": { "id": 11, "name": "Pantry" }, "chains": { "id": 2, "image_logo": "Fn5UddmJn1BlPWRArbh", "name": "New World" }, "products": { "amount": 8.23, "brand": "Value", "categoryID": 11, "details": "description 1", "id": 322, "image": "cxU9kT7bNp9fyR", "name": "Chicken Stock", "unitID": 3 }, "store_products": { "id": 342, "price": 3.29, "productID": 322, "storeID": 46 }, "stores": { "chainID": 2, "id": 46, "name": "PAK'nSAVE Hawera" }, "units": { "id": 3, "name": "l" } }, { "category": { "id": 11, "name": "Pantry" }, "chains": { "id": 2, "image_logo": "Fn5UddmJn1BlPWRArbh", "name": "New World" }, "products": { "amount": 8.23, "brand": "Value", "categoryID": 11, "details": "description 1", "id": 322, "image": "cxU9kT7bNp9fyR", "name": "Chicken Stock", "unitID": 3 }, "store_products": { "id": 718, "price": 7.36, "productID": 322, "storeID": 3 }, "stores": { "chainID": 2, "id": 3, "name": "New World Birkenhead" }, "units": { "id": 3, "name": "l" } }]
//
//     test('should create a new post', async () => {
//         const res = await request(server)
//             .get('/search_product?name=chicken&sort_by=price&sort_direction=ASC')
//         expect(res.body).toStrictEqual(correct_result)
//     })
// })
