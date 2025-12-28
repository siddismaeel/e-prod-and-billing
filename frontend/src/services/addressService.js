import { API_BASE_URL } from '../utils/constants';
import axios from 'axios';

// Address API uses same base URL (8080) with /org subpath
const addressApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add auth token interceptor (same as main API)
addressApi.interceptors.request.use(
  (config) => {
    // Ensure headers object exists
    if (!config.headers) {
      config.headers = {};
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Address API Request - Bearer token added to headers');
      console.log('Address API Request - URL:', config.url);
    } else {
      console.warn('Address API Request - No token found in localStorage');
      console.log('Address API Request - URL:', config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('Address API Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Address Service
 * Handles all address-related API calls (country, state, city)
 */

/**
 * Get all countries
 * @returns {Promise} API response with countries array
 */
export const getAllCountries = async () => {
  try {
    const response = await addressApi.get('/org/country/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

/**
 * Get all states by country ID
 * @param {number} countryId - Country ID
 * @returns {Promise} API response with states array
 */
export const getStatesByCountry = async (countryId) => {
  try {
    const response = await addressApi.get(`/org/state/all/${countryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching states:', error);
    throw error;
  }
};

/**
 * Get all cities by state ID
 * @param {number} stateId - State ID
 * @returns {Promise} API response with cities array
 */
export const getCitiesByState = async (stateId) => {
  try {
    const response = await addressApi.get(`/org/city/all/${stateId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

