const products = [
    "Organic Bananas", "Whole Milk", "Large Brown Eggs", "Wheat Bread", "Ground Coffee",
    "Red Apples", "Greek Yogurt", "Chicken Breast", "Baby Spinach", "Orange Juice",
]

const stores = [
    "New World Ashburton", "New World Balclutha", "New World Birkenhead",
    "PAK\'nSAVE Albany", "PAK\'nSAVE Alderman Dr Hen", "PAK\'nSAVE Blenheim",
]

const chains = [
    "New World",
    "Pak'n Save",
]

const category = [
    "Fruit & Veg",
    "Meat",
    "Baby & Child",
    "Health & Body",
]

const units = [
    "l",
    "kg",
    "ea",
]

const brands = [
    "Value", "Pams", "Maggi", "Pams Finest", "Copenhagen",
]

const details = [
    "description 1",
    "description 2",
    "description 3",
]

// count needs to be equal or less than the number of values when `isUnique: true`
const seed_e2e_test_data = (f: any) => ({
    products: {
        count: products.length,
        columns: {
            name: f.valuesFromArray({
                values: products,
                isUnique: true,
            }),
            brand: f.valuesFromArray({
                values: brands,
            }),
            details: f.valuesFromArray({
                values: details,
            }),
            amount: f.number({
                minValue: 1,
                precision: 100,
                maxValue: 10,
            }),
        },
        with: {
            price_history: 31,
        },
    },
    stores: {
        count: stores.length,
        columns: {
            name: f.valuesFromArray({
                values: stores,
                isUnique: true,
            }),
        },
    },
    chains: {
        count: chains.length,
        columns: {
            name: f.valuesFromArray({
                values: chains,
                isUnique: true,
            }),
        },
    },
    store_products: {
        count: 30,
        columns: {
            price: f.number({
                minValue: 1,
                precision: 100,
                maxValue: 20,
            }),
        },
    },
    category: {
        count: category.length,
        columns: {
            name: f.valuesFromArray({
                values: category,
                isUnique: true,
            }),
        },
    },
    units: {
        count: units.length,
        columns: {
            name: f.valuesFromArray({
                values: units,
                isUnique: true,
            }),
        },
    },
    price_history: {
        columns: {
            count: 10,
            date: f.date({
                minDate: "2025-01-01",
                maxDate: "2025-01-31",
            }),
            price: f.number({
                minValue: 1,
                precision: 100,
                maxValue: 1000,
            }),

        },
    },
    shopping_list: {
        count: 10,
        columns: {
            amount: f.int({
                minValue: 1,
                maxValue: 10,
            }),
        }
    },
})

export default seed_e2e_test_data
