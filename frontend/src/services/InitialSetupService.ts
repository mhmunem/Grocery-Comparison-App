import axios from 'axios';
import { API_URL, API_ENDPOINTS } from '../utils/constants';


// Helper function to handle all requests
const request = async (method: string, url: string, data = null) => {
  try {
    const response = await axios({ method, url, data });
    return response.data;
  } catch (error) {
    console.error(`${method.toUpperCase()} request error:`, error);
    throw error;
  }
};

// GET home data
export const getInitialSetupMessage = () => request('get', `${API_URL}${API_ENDPOINTS.WELCOME_API}`);

// GET initial setup data
export const getInitialSetup = () => request('get', `${API_URL}${API_ENDPOINTS.GET_DATA}`);

// POST initial setup data
export const postInitialSetup = () => request('post', `${API_URL}${API_ENDPOINTS.POST_DATA}`);

// PUT initial setup data
export const putInitialSetup = (id: string) => request('put', `${API_URL}${API_ENDPOINTS.PUT_DATA.replace(':id', id)}`);

// DELETE initial setup data
export const deleteInitialSetup = (id: string) => request('delete', `${API_URL}${API_ENDPOINTS.DELETE_DATA.replace(':id', id)}`);
