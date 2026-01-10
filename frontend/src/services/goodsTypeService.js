import { apiService } from './api';

/**
 * Goods Type Service
 * Handles all goods type-related API calls
 */

/**
 * Get all goods types
 * @returns {Promise} Array of goods types
 */
export const getAllGoodsTypes = async () => {
  try {
    // Try to fetch from API endpoint if it exists
    const response = await apiService.get('/billing/api/goods-types');
    return response.data?.data || response.data || [];
  } catch (error) {
    // If endpoint doesn't exist, return empty array
    // Goods type can be obtained from raw material's goodsTypeId
    console.warn('Goods types API endpoint not available. Using raw material goodsTypeId instead.');
    return [];
  }
};



