import { PlaywrightCrawler } from 'crawlee';
import insertCategories from '../drizzleQuery/insertCategories';

const WoolworthsCategoryScraper = new PlaywrightCrawler({
    launchContext: {
        launchOptions: { headless: true },
    },
    async requestHandler({ page, request, log }) {
        log.info(`Processing: ${request.url}`);

        const categories = await page.$$eval('a.dasFacetHref', elements => {
            return elements.map(el => {
                const facetData = JSON.parse(el.getAttribute('data-facet-data')|| '{}');
                return {
                    name: facetData.name,
                };
            });
        });
        
        console.log('Categories:', categories);
        for (const cat of categories) {
            console.log(cat.name);
            //await insertCategories(cat.name);
        }
    },
    sessionPoolOptions: {
        blockedStatusCodes: [],
    }
});

export default WoolworthsCategoryScraper;

