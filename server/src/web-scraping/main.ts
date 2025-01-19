import categoriesUrl from "./constants/categoriesUrl";
import WoolworthsCategoryScraper from "./scraper/WoolworthsCategoryScraper";
import WoolworthsProductScraper from "./scraper/WoolworthsProductScraper";
import chainScraper from "./scraper/chainScraper";
import storeScraper from "./scraper/storeScraper";

async function runScrapers(): Promise<undefined> {
    try {
      await chainScraper;
      console.log("Chain scraping completed");

      await storeScraper;
      console.log("Store scraping completed");

      for (const store of categoriesUrl) {
        if (store.name === "Woolworths") {
          await WoolworthsCategoryScraper.run([{ url: store.categoriesUrl }]);
          console.log(" category scraper completed");
          await WoolworthsProductScraper.run([{ url: store.categoriesUrl }]);
          console.log(`produts scraping completed for ${store.name}`);
        }
        console.log(" produts scraper completed");
      }
    } catch (error) {
      console.error("Error during scraping:", error);
    }
  }

  runScrapers();
