import { PlaywrightCrawler, Dataset } from 'crawlee';


const WoolworthsProductScraper = new PlaywrightCrawler({
    launchContext: {
        launchOptions: {
            headless: false, 
        },
    },
    requestHandler: async ({ page, request, enqueueLinks, log }) => {
        log.info(`Processing: ${request.url}`);
        
        await page.waitForSelector('div.product-entry');

        const products = await page.$$eval('div.product-entry.product-cup.ng-star-inserted', (tiles) => {
            return tiles.map(tile => {
                const name = tile.querySelector('h3[id^="product-"][id$="-title"]')?.textContent?.trim() || 'N/A';
                const image = tile.querySelector('img')?.src || 'N/A';
        
                const unitPriceElement = tile.querySelector('.cupPrice');
                const unitPrice = unitPriceElement ? unitPriceElement.textContent?.trim() : 'N/A';
        
                let amount = 'N/A';
                let price = 'N/A';
                let unit = 'N/A';
                if (unitPrice !== 'N/A') {
                    // const match = unitPrice?.match(/\$(\d+\.\d+)\s*\/\s*([\w]+)/);
                    const match = unitPrice?.match(/\$(\d+\.\d+)\s*\/\s*([\d.]+)\s*(\w+)/);
                    if (match) {
                        price = `$${match[1]}`;
                        amount = match[2];
                        unit = match[3];
                    }
                }
        
                const averagePrice = tile.querySelector('.price-single-unit-text')?.textContent?.trim() || 'N/A';
        
                return {
                    name,
                    amount,
                    image,
                    price,
                    unit,
                    averagePrice,
                    store:"Woolworths",
                };
            });
        });

        if (products.length > 0) {
            await Dataset.pushData(products);
            log.info(`Saved ${products.length} products from ${request.url}`);
        } else {
            log.warning(`No products found on ${request.url}`);
        }
    
        await enqueueLinks({
            selector: 'a[href^="/shop/browse/"]',
            transformRequestFunction: req => {
                req.uniqueKey = req.url;
                return req;
            },
        });
    },    

    failedRequestHandler: async ({ request }) => {
        console.error(`Failed to process ${request.url}`);
    },

    maxConcurrency: 2,
    maxRequestsPerCrawl: 50,
    sessionPoolOptions: {
        blockedStatusCodes: [],
    },
});

export default WoolworthsProductScraper;
