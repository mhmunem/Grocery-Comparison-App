import axios from 'axios'
import { eq } from 'drizzle-orm'
import db from '../../db/connection/pool'
import { products } from '../../db/schema/products'
import { store_products } from '../../db/schema/store_products'
import { units } from '../../db/schema/units'
import { category } from '../../db/schema/category'
import { stores } from '../../db/schema/stores'
import { ilike } from 'drizzle-orm'
import { price_history } from '../../db/schema/price_history'


async function fetchGrosaveStores() {
    const response = await axios.get('https://grosave.co.nz/api/allstores')
    return response.data.data
}

async function fetchPriceHistory(productId: number, brand: number, storeName: string, insertedProductID: number) {
    const storeNameFormatted = storeName.replace(/\s+/g, '+')
    const priceHistoryUrl = `https://grosave.co.nz/api/pricehistory?productId=${productId}&stores=${brand}_${storeNameFormatted}`

    try {
        const priceHistoryResponse = await axios.get(priceHistoryUrl)
        const priceHistoryData = priceHistoryResponse.data.data.price_history
        if (priceHistoryData) {
            for (const historyEntry of priceHistoryData) {
                await db.insert(price_history).values({
                    date: historyEntry.date,
                    price: historyEntry.price,
                    productID: insertedProductID
                }).onConflictDoUpdate({
                    target: [price_history.date, price_history.productID],
                    set: {
                        price: historyEntry.price
                    }
                }).execute()
            }
        }else{
          console.log(`No data found for product' ${insertedProductID}` )  
        }
    } catch (error) {
        console.error(`Error fetching price history for product ${productId}:`, error)
    }
}



async function GroSaveProductsScraper() {
    const grosaveStores = await fetchGrosaveStores()

    for (const store of grosaveStores) {
        let page = 1
        let hasMore = true

        while (hasMore) {
            const url = `https://grosave.co.nz/search?page=${page}&storeId=${store.id}&cutOffOldData=true&_data=routes/search`
            const response = await axios.get(url)
            const data = response.data

            if (data.loaderSearchResults.length === 0) {
                hasMore = false
                continue
            }

            for (const product of data.loaderSearchResults) {
                const priceDetails = Object.values(product.price_details)[0] as {
                    primary_image_url: string,
                    unit: string
                    quantity: number
                    original_price: number
                    original_store_categories: string[]
                }

                if (typeof priceDetails === 'object' && priceDetails !== null) {

                    const unitResult = await db.insert(units).values({ name: priceDetails.unit }).onConflictDoUpdate({ target: units.name, set: { name: priceDetails.unit } }).returning().execute()
                    const unitId = unitResult[0]?.id

                    if (!unitId) {
                        console.error(`Failed to insert or get unit for ${priceDetails.unit}`)
                        continue
                    }
                    const categoryName = priceDetails.original_store_categories[0]

                    let categoryId: number | undefined
                    const categoriesResult = await db.select().from(category).where(ilike(category.name, priceDetails.original_store_categories[0]!)).limit(1)

                    if (categoriesResult.length === 0) {

                        const insertedCategory = await db.insert(category).values({ name: priceDetails.original_store_categories[0]! }).returning().execute()
                        categoryId = insertedCategory[0]?.id
                        console.log(`New category inserted: ${categoryName}`)
                    } else {
                        categoryId = categoriesResult[0]!.id
                    }

                    if (!categoryId) {
                        console.error(`Failed to get or insert category for ${categoryName}`)
                        continue
                    }

                    const insertedProduct = await db.insert(products).values({
                        name: product.name,
                        brand: product.brand,
                        details: '',
                        amount: priceDetails.quantity,
                        image: priceDetails.primary_image_url,
                        unitID: unitId,
                        categoryID: categoryId
                    }).onConflictDoUpdate({
                        target: products.name,
                        set: {
                            brand: product.brand,
                            details: '',
                            amount: priceDetails.quantity,
                            image: priceDetails.primary_image_url,
                            unitID: unitId,
                            categoryID: categoryId
                        }
                    }).returning().execute()

                    const dbStore = await db.select().from(stores).where(ilike(stores.name, store.name)).limit(1)


                    if (!dbStore.length) {
                        console.log(`Store ${store.name} not found in database. Skipping.`)
                        continue
                    }

                    if (insertedProduct[0] && insertedProduct[0].id) {
                        await db.insert(store_products).values({
                            storeID: dbStore[0]!.id,
                            productID: insertedProduct[0].id,
                            price: priceDetails.original_price,
                        }).onConflictDoUpdate({
                            target: [store_products.storeID, store_products.productID],
                            set: { price: priceDetails.original_price }
                        }).execute()
                        await fetchPriceHistory(product.id, store.brand.id, store.name, insertedProduct[0].id)
                    } else {
                        console.error(`Failed to insert store product for ${product.name}`)
                    }

                }
                console.log(`New prodcuts inserted`)
                page++
            }
        }
    }
}


export default GroSaveProductsScraper()