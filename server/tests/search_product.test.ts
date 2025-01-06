import { Pool } from "pg";
import { search_product } from "../src/search/search";
import { drizzle } from "drizzle-orm/node-postgres";
import router from "../src/routes/initialsetup";
import express from "express";

// // TODO: finish test, setup in Kilo's branch sort-backend-logic
// test('find some products', async () => {
//     jest.mock('pg', () => {
//         const pool = {
//             query: jest.fn(),
//             connect: jest.fn(),
//             end: jest.fn()
//         }
//         return { Pool: jest.fn(() => pool) }
//     })
//
//     const app = express()
//
//     const config = {
//         user: process.env.DB_USER || "postgres",
//         host: process.env.DB_HOST || "fullstack_db",
//         database: process.env.DB_NAME || "postgres",
//         password: process.env.DB_PASSWORD || "cosc680",
//         port: parseInt(process.env.DB_PORT || "5432"),
//     };
//
//     const pool = new Pool(config);
//     const db = drizzle(pool);
//
//     return search_product(db, 'chick', 'name', 'ASC').then(result => {
//         expect(result).toBe([
//             'Barley',
//             'Barley',
//             'Energy Bars',
//             'Granola Bars',
//             'Granola Bars',
//             'Granola Bars',
//             'Protein Bars'
//         ])
//     })
// })
