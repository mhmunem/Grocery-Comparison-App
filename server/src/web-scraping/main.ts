import chainScraper from "./scraper/chainScraper";
import storeScraper from "./scraper/storeScraper";

async function runScrapers() {
    try {
      await chainScraper;
      console.log("Chain scraping completed");
      await storeScraper;
      console.log("Store scraping completed");
    } catch (error) {
      console.error("Error during scraping:", error);
    }
  }
  
runScrapers();