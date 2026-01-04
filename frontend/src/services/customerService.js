import { apiService } from './api';

/**
 * Customer Service
 * Handles all customer-related API calls
 */

/**
 * Get all customers
 * @returns {Promise} Array of customers
 */
export const getAllCustomers = async () => {
  try {
    const response = await apiService.get('/billing/api/customers');
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

/**
 * Get customer by ID
 * @param {number} id - Customer ID
 * @returns {Promise} Customer object
 */
export const getCustomerById = async (id) => {
  try {
    const response = await apiService.get(`/billing/api/customers/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
};

/**
 * Create or update customer
 * @param {Object} customerData - Customer data object
 * @returns {Promise} API response
 */
export const createCustomer = async (customerData) => {
  try {
    const response = await apiService.post('/billing/api/customers', customerData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

/**
 * Get customers for dropdown (id and name only)
 * @returns {Promise} Array of customer dropdown objects
 */
export const getCustomersForDropdown = async () => {
  try {
    const response = await apiService.get('/billing/api/customers/dropdown');
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching customers for dropdown:', error);
    throw error;
  }
};


