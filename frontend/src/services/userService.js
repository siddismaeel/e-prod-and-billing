import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// User API uses /user-setup base path
const USER_API_BASE_URL = `${API_BASE_URL}/user-setup`;

// Create axios instance for user API
const userApi = axios.create({
  baseURL: USER_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add auth token interceptor
userApi.interceptors.request.use(
  (config) => {
    // Ensure headers object exists
    if (!config.headers) {
      config.headers = {};
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('User API Request - Bearer token added to headers');
      console.log('User API Request - URL:', config.url);
    } else {
      console.warn('User API Request - No token found in localStorage');
      console.log('User API Request - URL:', config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('User API Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

/**
 * User Service
 * Handles all user-related API calls
 */

/**
 * Create a new user
 * @param {Object} userData - User data object
 * @param {number} userData.userId - User ID (0 for creation)
 * @param {string} userData.firstName - First name
 * @param {string} userData.lastName - Last name
 * @param {number} userData.stateId - State ID
 * @param {number} userData.cityId - City ID
 * @param {number} userData.countryId - Country ID
 * @param {string} userData.email - Email
 * @param {number} userData.branchId - Branch ID
 * @param {number} userData.departmentId - Department ID
 * @param {number} userData.organizationId - Organization ID
 * @param {number} userData.componyId - Company ID (note: typo in API)
 * @param {string} userData.address - Address
 * @param {string} userData.phone - Phone
 * @param {Array<number>} userData.roleIds - Role IDs array
 * @returns {Promise} API response
 */
export const createUser = async (userData) => {
  try {
    const payload = {
      userId: 0, // Set to 0 for creation
      firstName: userData.firstName,
      lastName: userData.lastName,
      stateId: userData.stateId,
      cityId: userData.cityId,
      countryId: userData.countryId,
      email: userData.email,
      branchId: userData.branchId,
      departmentId: userData.departmentId,
      organizationId: userData.organizationId,
      componyId: userData.componyId, // Note: typo in API payload
      address: userData.address,
      phone: userData.phone,
      roleIds: userData.roleIds || [],
    };

    console.log('Creating user with payload:', payload);
    const response = await userApi.post('/users/save', payload);
    console.log('User created successfully:', response.data);
    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Get user by ID
 * @param {number} userId - User ID
 * @returns {Promise} API response
 */
export const getUserById = async (userId) => {
  try {
    const response = await userApi.get(`/users/${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Get all users
 * @returns {Promise} API response
 */
export const getAllUsers = async () => {
  try {
    const response = await userApi.get('/users/all');
    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get all users by company ID
 * @param {number} companyId - Company ID
 * @returns {Promise} Array of users
 */
export const getUsersByCompanyId = async (companyId) => {
  try {
    const response = await userApi.get(`/users/all/${companyId}`);
    // Handle nested response structure: response.data.data
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching users by company:', error);
    throw error;
  }
};


