import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Ensure headers object exists
    if (!config.headers) {
      config.headers = {};
    }
    
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Request - Bearer token added to headers');
      console.log('API Request - URL:', config.url);
      console.log('API Request - Method:', config.method);
    } else {
      console.warn('API Request - No token found in localStorage');
      console.log('API Request - URL:', config.url);
      console.log('API Request - Method:', config.method);
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          // window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden: Access denied');
          break;
        case 404:
          console.error('Not Found: Resource not found');
          break;
        case 500:
          console.error('Server Error: Internal server error');
          break;
        default:
          console.error('Error:', error.response.data?.message || error.message);
      }
    } else if (error.request) {
      console.error('Network Error: No response received');
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API methods (placeholder - to be extended)
export const apiService = {
  // GET request
  get: (url, config = {}) => api.get(url, config),
  
  // POST request
  post: (url, data, config = {}) => api.post(url, data, config),
  
  // PUT request
  put: (url, data, config = {}) => api.put(url, data, config),
  
  // PATCH request
  patch: (url, data, config = {}) => api.patch(url, data, config),
  
  // DELETE request
  delete: (url, config = {}) => api.delete(url, config),
};

export default api;


