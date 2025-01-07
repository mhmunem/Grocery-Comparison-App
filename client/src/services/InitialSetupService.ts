import axios from 'axios';
import { API_URL, API_ENDPOINTS } from '../utils/constants';


async function request(method: 'get' | 'post' | 'put' | 'delete', url: string, data?: null) {
    try {
        return (await axios({ method, url, data })).data
    } catch (error) {
        console.error(`${method.toUpperCase()} request error:`, error);
        throw error;
    }
}

export const getInitialSetupMessage = () => request('get', `${API_URL}${API_ENDPOINTS.WELCOME_API}`);

export const getInitialSetup = () => request('get', `${API_URL}${API_ENDPOINTS.GET_DATA}`);

export const postInitialSetup = () => request('post', `${API_URL}${API_ENDPOINTS.POST_DATA}`);

export const putInitialSetup = (id: string) => request('put', `${API_URL}${API_ENDPOINTS.PUT_DATA.replace(':id', id)}`);

export const deleteInitialSetup = (id: string) => request('delete', `${API_URL}${API_ENDPOINTS.DELETE_DATA.replace(':id', id)}`);

export const getSearch = (name: string, sort_by: string, sort_direction: string) => request(
    'get', `${API_URL}${API_ENDPOINTS.SEARCH_PRODUCT}?name=${name}&sort_by=${sort_by}&sort_direction=${sort_direction}`
);
