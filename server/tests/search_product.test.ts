import { search_product } from "../src/search/search";
import { SortBy } from "../src/types/routes";
import { SortDirection } from "../src/types/routes";
import db from "../src/db/connection/pool";


// TODO: finish test, setup in Kilo's branch sort-backend-logic
describe('search_product', () => {

    test('the data is peanut butter', async () => {
        const data = await search_product(db, 'chick', 'price' as SortBy, 'ASC' as SortDirection)
        expect(data)
            .toBe([
                'Barley',
                'Barley',
                'Energy Bars',
                'Granola Bars',
                'Granola Bars',
                'Granola Bars',
                'Protein Bars'
            ])
    });
})

