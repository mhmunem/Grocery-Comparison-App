import insertChains from '../drizzleQuery/insertChain'

const chainScraper = async () => {
    try {
        await insertChains() 
        console.log('All chains inserted successfully.')
    } catch (error) {
        console.error('Error during scraping:', error)
    }
}

export default chainScraper();