import app from "../src/app"
import request from "supertest"
import { SortBy } from "../src/types/routes"
import { SortDirection } from "../src/types/routes"
import { search_product } from "../src/search/search"
import { test_db, test_pool } from "./test_utils"


describe("Function tests search_product", () => {
    afterAll(async () => {
        await test_pool.end()
    })

    const results: any = ["CMilk", "AMilk", "BMilk"]

    // Function tests
    test("all results", async () => {
        return await search_product(test_db, "", "price" as SortBy, "ASC" as SortDirection).then(data => {
            expect(data.map(e => e.products.name)).toStrictEqual(results)
        })
    })

    test("no results", async () => {
        return await search_product(test_db, "SHOE", "price" as SortBy, "ASC" as SortDirection).then(data => {
            expect(data.map(e => e.products.name)).toStrictEqual([])
        })
    })

    test("sorting by name DESC", async () => {
        return await search_product(test_db, "MILK", "name" as SortBy, "DESC" as SortDirection).then(data => {
            expect(data.map(e => e.products.name)).toStrictEqual(
                results.slice().sort((a: any, b: any) => a.localeCompare(b)).reverse()
            )
        })
    })

    test("sorting by amount DESC", async () => {
        return await search_product(test_db, "MILK", "amount" as SortBy, "DESC" as SortDirection).then(data => {
            expect(data.map(e => e.products.name)).toStrictEqual(results.slice().reverse())
        })
    })

    test("sort by price DESC", async () => {
        return await search_product(test_db, "MILK", "price" as SortBy, "DESC" as SortDirection).then(data => {
            expect(data.map(e => e.products.name)).toStrictEqual(results.slice().reverse())
        })
    })

    test("sorting by name ASC", async () => {
        return await search_product(test_db, "MILK", "name" as SortBy, "ASC" as SortDirection).then(data => {
            expect(data.map(e => e.products.name)).toStrictEqual(results.slice().sort(
                (a: any, b: any) => a.localeCompare(b))
            )
        })
    })

    test("sorting by amount ASC", async () => {
        return await search_product(test_db, "MILK", "amount" as SortBy, "ASC" as SortDirection).then(data => {
            expect(data.map(e => e.products.name)).toStrictEqual(results)
        })
    })

    test("sort by price ASC", async () => {
        return await search_product(test_db, "MILK", "price" as SortBy, "ASC" as SortDirection).then(data => {
            expect(data.map(e => e.products.name)).toStrictEqual(results)
        })
    })

    // API test
    test("GET /search_product", async () => {
        const { body: data } = await request(app).get("/search_product?name=milk&sort_by=price&sort_direction=ASC")

        return expect(data.map((e: any) => e.products.name)).toStrictEqual(results)
    })
})
