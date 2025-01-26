import app from "../src/app"
import request from "supertest"
import { get_category } from "../src/query/categoryQuery"
import { test_db, test_pool } from "./test_utils"


describe('get_category function tests', () => {
    afterAll(async () => {
        await test_pool.end()
    })

    const results = [
        { id: 1, name: 'category' },
        { id: 2, name: 'category' },
        { id: 3, name: 'category' }
    ]

    test('all results', async () => {
        return await get_category(test_db).then(data => {
            expect(data).toEqual(results)
        })
    })

    // API test
    test("GET /category", async () => {
        const { body: data } = await request(app).get("/category")

        return expect(data).toStrictEqual(results)
    })
})


