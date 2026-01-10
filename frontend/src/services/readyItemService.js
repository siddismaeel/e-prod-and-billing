import { apiService } from './api';

/**
 * Ready Item Service
 * Handles all ready item-related API calls
 */

/**
 * Get all ready items
 * @returns {Promise} Array of ready items
 */
export const getAllReadyItems = async () => {
  try {
    const response = await apiService.get('/api/ready-items');
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching ready items:', error);
    throw error;
  }
};

/**
 * Get ready item by ID
 * @param {number} id - Ready item ID
 * @returns {Promise} Ready item object
 */
export const getReadyItemById = async (id) => {
  try {
    const response = await apiService.get(`/api/ready-items/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching ready item:', error);
    throw error;
  }
};

/**
 * Create or update ready item
 * @param {Object} readyItemData - Ready item data object
 * @returns {Promise} API response
 */
export const upsertReadyItem = async (readyItemData) => {
  try {
    const response = await apiService.post('/api/ready-items', readyItemData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error upserting ready item:', error);
    throw error;
  }
};



