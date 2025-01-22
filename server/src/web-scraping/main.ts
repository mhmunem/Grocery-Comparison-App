import chainScraper from "./scraper/chainScraper";
import GroSaveCategoryScraper from "./scraper/GroSaveCategoryScraper";
import GroSaveProductsScraper from "./scraper/GroSaveProductsScraper";
import GrosaveStoresScraper from "./scraper/GrosaveStoresScraper";

async function runScrapers(): Promise<undefined> {
    try {
      await chainScraper;
      console.log("Chain scraping completed");

      await GrosaveStoresScraper;
      console.log("Stores scraped completely");

      await GroSaveCategoryScraper;
      console.log("Categories scraped completely");

      await GroSaveProductsScraper;
      console.log("Products scraped completely");

    } catch (error) {
      console.error("Error during scraping:", error);
    }
  }

  runScrapers();
