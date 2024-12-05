## Crawlee Setup Guide

### Overview

We are using Crawlee, a robust web scraping and automation library, to build scalable crawlers with support for multiple frameworks like Playwright, Puppeteer, and Cheerio.
Future iterations may include cloud deployment for enhanced scalability and storage.

### Prerequisites

- Node.js (node -v)
- npm (Node Package Manager) or yarn (npm -v)
- A folder for the project is already created.


### Installation

1. Clone the repo 

    ``` 
    git clone -b <branch_name> <repo_url>
        
    cd webscraping
    ```

2. Install Dependencies (if not in package.json file else just use 'npm install')
   Install Crawlee with support for Playwright, Puppeteer, and Cheerio:

   ``` 
   npm install crawlee playwright puppeteer cheerio
   ```

---

### Configure Crawlers

#### PlaywrightCrawler  
Playwright is used for advanced interactions with modern web pages. Example setup:

```
const { PlaywrightCrawler } = require('crawlee');

const playwrightCrawler = new PlaywrightCrawler({
    headless: true, // Set to false for visible browser
    async requestHandler({ page, request }) {
        console.log(`Scraping ${request.url}`);
        const content = await page.content();
        console.log(content);
    },
});

await playwrightCrawler.run(['https://crawlee.dev']);
```

#### PuppeteerCrawler  
Puppeteer is another headless browser framework, ideal for scraping JavaScript-heavy websites.

```
const { PuppeteerCrawler } = require('crawlee');

const puppeteerCrawler = new PuppeteerCrawler({
    headless: true, // Set to false for debugging
    async requestHandler({ page, request }) {
        console.log(`Scraping ${request.url}`);
        const content = await page.content();
        console.log(content);
    },
});

await puppeteerCrawler.run(['https://crawlee.dev']);
```

#### CheerioCrawler  
Cheerio is a lightweight and fast solution for scraping static HTML pages.

```
const { CheerioCrawler } = require('crawlee');

const cheerioCrawler = new CheerioCrawler({
    async requestHandler({ $ }) {
        console.log('Scraping static content');
        const title = $('title').text();
        console.log(`Page title: ${title}`);
    },
});

await cheerioCrawler.run(['https://crawlee.dev']);
```

### Running the Crawler

Run the following command to execute your script:

```
node src/main.js
```

Check the ```package.json``` scripts to start the server if none use the above scripts


## Resources

Here are helpful resources for understanding and extending this project:

1. [Crawlee Introduction](https://crawlee.dev/docs/introduction)
2. [PlaywrightCrawler API Reference](https://crawlee.dev/api/playwright-crawler/class/PlaywrightCrawler)
4. [PuppeteerCrawler API Reference](https://crawlee.dev/api/puppeteer-crawler/class/PuppeteerCrawler)
3. [PlaywrightCrawler Example](https://crawlee.dev/docs/examples/playwright-crawler)
5. [PuppeteerCrawler Example](https://crawlee.dev/docs/examples/basic-crawler)
6. [CheerioCrawler Example](https://crawlee.dev/docs/examples/cheerio-crawler)


## Future Development

### Cloud Deployment  
Consider deploying Crawlee project to the cloud to scale operations and achieve persistent storage. 
For guidance, refer to the [Crawlee Cloud Documentation](https://crawlee.dev/).


