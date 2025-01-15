import axios from 'axios';
import insertOrUpdateStores from '../drizzleQuery/insertStores';


const fetchStores = async () => {
    const response = await axios.get('https://backend.grocer.nz/stores');
   // console.log(response,response.data);
    return response.data;
};

const storeScraper = async () => {
    try {
        const storesData = await fetchStores(); 
        await insertOrUpdateStores(storesData); 
        console.log('All stores inserted successfully.');
    } catch (error) {
        console.error('Error during scraping:', error);
    }
};

export default storeScraper();
