import axios from 'axios'
import db from '../../db/connection/pool'
import { products } from '../../db/schema/products'
import { store_products } from '../../db/schema/store_products'
import { units } from '../../db/schema/units'
import { category } from '../../db/schema/category'
import { stores } from '../../db/schema/stores'
import { eq, ilike } from 'drizzle-orm'
import { price_history } from '../../db/schema/price_history'
import { PlaywrightCrawler } from 'crawlee'

async function updateProductPrices(productDetails: any[]) {

    for (const product of productDetails) {
        const existingProduct = await db.select().from(products)
            .where(eq(products.name, product.name))
            .limit(1)

        if (!existingProduct.length) {
            console.log(`Product ${product.name} not found. Skipping.`)
            continue
        }

        for (const priceEntry of product.prices) {
            if (Object.keys(priceEntry).length === 0) continue

            const dbStore = await db.select().from(stores)
                .where(eq(stores.name, priceEntry.store_name.toString()))
                .limit(1)

            if (!dbStore.length) {
                console.log(`Store ${priceEntry.store_name} not found. Skipping.`)
                continue
            }

            await db.insert(store_products).values({
                storeID: dbStore[0]!.id,
                productID: existingProduct[0]!.id,
                price: priceEntry.original_price,
            }).onConflictDoUpdate({
                target: [store_products.storeID, store_products.productID],
                set: {
                    price: priceEntry.original_price
                }
            }).execute()

            await db.insert(price_history).values({
                date: new Date().toDateString(),
                price: priceEntry.original_price,
                productID: existingProduct[0]!.id,
                storeID: dbStore[0]!.id,
            }).onConflictDoUpdate({
                target: [price_history.date, price_history.productID, price_history.storeID],
                set: {
                    price: priceEntry.original_price
                }
            }).execute()
        }
    }
}

async function GrocerProductsScraper() {
    const crawler = new PlaywrightCrawler({
        async requestHandler({ page }) {
            await page.route('https://search.grocer.nz/indexes/products/search', async (route, interceptedRequest) => {
                const headers = interceptedRequest.headers()
                const authorizationHeader = headers['authorization']

                if (authorizationHeader) {
                    const payload = {
                        q: "",
                        attributesToRetrieve: ["*"],
                        limit: 99999,
                        offset: 0,
                    }

                    try {
                        const response = await axios.post(
                            'https://search.grocer.nz/indexes/products/search',
                            payload,
                            {
                                headers: {
                                    ...headers,
                                    Authorization: authorizationHeader,
                                },
                            }
                        )

                        const productHits = response.data.hits
                        const processedProductDetails: any[] = []

                        for (const product of productHits) {
                            const productId = product.id
                            const storeIds = product.stores

                            const categories = [...product.category_1]
                            for (const categoryName of categories) {
                                await db.insert(category).values({ name: categoryName })
                                    .onConflictDoUpdate({
                                        target: category.name,
                                        set: { name: categoryName }
                                    })
                                    .execute()

                                for (const storeId of storeIds) {
                                    try {
                                        const productDetailsResponse = await axios.get(`https://backend.grocer.nz/products`, {
                                            params: {
                                                'productIds[]': [productId],
                                                'storeIds[]': [storeId]
                                            }
                                        })

                                        const productDetails = productDetailsResponse.data[0]

                                        const unitResult = await db.insert(units).values({ name: productDetails.unit || 'Unknown' })
                                            .onConflictDoUpdate({
                                                target: units.name,
                                                set: { name: productDetails.unit || 'Unknown' }
                                            })
                                            .returning().execute()
                                        const unitId = unitResult[0]?.id

                                        if (!unitId) {
                                            console.error(`Failed to insert or get unit for ${productDetails.unit}`)
                                            continue
                                        }

                                        let categoryId: number | undefined
                                        for (const categoryName of categories) {
                                            const categoriesResult = await db.select().from(category)
                                                .where(ilike(category.name, categoryName))
                                                .limit(1)
                                            if (categoriesResult.length > 0) {
                                                categoryId = categoriesResult[0]!.id
                                                break
                                            }
                                        }

                                        if (!categoryId) {
                                            console.error(`Failed to get category for ${productDetails.name}`)
                                            continue
                                        }

                                        const insertedProduct = await db.insert(products).values({
                                            name: productDetails.name,
                                            brand: productDetails.brand,
                                            details: '',
                                            amount: productDetails.size || 1,
                                            image: `https://grocer-au.syd1.cdn.digitaloceanspaces.com/products/${productDetails.id}.webp`,
                                            unitID: unitId,
                                            categoryID: categoryId
                                        }).onConflictDoUpdate({
                                            target: products.name,
                                            set: {
                                                brand: productDetails.brand,
                                                details: '',
                                                amount: productDetails.size || 1,
                                                image: `https://grocer-au.syd1.cdn.digitaloceanspaces.com/products/${productDetails.id}.webp`,
                                                unitID: unitId,
                                                categoryID: categoryId
                                            }
                                        }).returning().execute()

                                        processedProductDetails.push(productDetails)

                                        console.log(`Processed product: ${productDetails.name} for store ${storeId}`)
                                    } catch (storeError) {
                                        console.error(`Error processing product ${productId} for store ${storeId}:`, storeError)
                                        continue
                                    }
                                }
                            }

                            await updateProductPrices(processedProductDetails)

                            console.log(`New products inserted and prices updated`)
                        }
                    } catch (error) {
                        console.error('Error while processing Grocer data:', error)
                    }
                } else {
                    console.warn('Missing Authorization header.')
                }

                await route.continue()
            })

            await page.goto('https://grocer.nz/search')
            await page.waitForTimeout(5000)
        },
    })

    await crawler.run(['https://grocer.nz/search'])
}

export default GrocerProductsScraper
