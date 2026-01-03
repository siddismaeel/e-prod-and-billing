import { apiService } from './api';

/**
 * Production Service
 * Handles all production-related API calls
 */

/**
 * Get all productions
 * @returns {Promise} Array of productions
 */
export const getAllProductions = async () => {
  try {
    const response = await apiService.get('/api/productions');
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching productions:', error);
    throw error;
  }
};

/**
 * Create production record
 * @param {Object} productionData - Production data object
 * @returns {Promise} API response
 */
export const produceReadyItem = async (productionData) => {
  try {
    const response = await apiService.post('/api/productions', productionData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error creating production:', error);
    throw error;
  }
};

