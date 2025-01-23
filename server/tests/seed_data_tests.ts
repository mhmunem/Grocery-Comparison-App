const seed_data_tests = (f: any) => ({
    products: {
        count: 3,
        columns: {
            brand: f.valuesFromArray({
                values: [
                    "value"
                ],
            }),
            details: f.valuesFromArray({
                values: [
                    "description",
                ],
            }),
            amount: f.valuesFromArray({
                values: [
                    1.1,
                    2.1,
                    3.1,
                ],
                isUnique: true
            }),
            name: f.valuesFromArray({
                values: [
                    "AMilk",
                    "BMilk",
                    "CMilk",
                ],
                isUnique: true
            }),
        },
    },
    stores: {
        count: 1,
        columns: {
            name: f.valuesFromArray({
                values: [
                    "store"
                ],
            }),
        },
    },
    chains: {
        count: 1,
        columns: {
            name: f.valuesFromArray({
                values: [
                    "chain",
                ],
            }),
        },
    },
    store_products: {
        count: 3,
        columns: {
            price: f.number({
                minValue: 1,
                precision: 100,
                maxValue: 20,
            }),
            productID: f.valuesFromArray({
                values: [
                    1,
                    2,
                    3,
                ],
                isUnique: true
            }),
        },
    },
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
    units: {
        count: 1,
        columns: {
            name: f.valuesFromArray({
                values: [
                    "l",
                ],
            }),
        },
    },
    price_history: {
        count: 31,
        columns: {
            productID: f.valuesFromArray({
                values: [
                    1
                ]
            }),
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
})


export default seed_data_tests
