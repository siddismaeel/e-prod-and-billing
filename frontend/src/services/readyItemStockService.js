import { apiService } from './api';

/**
 * Ready Item Stock Service
 * Handles all ready item stock-related API calls
 */

/**
 * Get current stock for ready item
 * @param {number} id - Ready item ID
 * @returns {Promise} Current stock quantity
 */
export const getCurrentStock = async (id) => {
  try {
    const response = await apiService.get(`/api/ready-items/${id}/stock/current`);
    return response.data?.data || response.data || 0;
  } catch (error) {
    console.error('Error fetching current stock:', error);
    throw error;
  }
};

/**
 * Get stock by date for ready item
 * @param {number} id - Ready item ID
 * @param {string} date - Date (ISO format)
 * @returns {Promise} Stock data object
 */
export const getStockByDate = async (id, date) => {
  try {
    const response = await apiService.get(`/api/ready-items/${id}/stock`, {
      params: { date }
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching stock by date:', error);
    throw error;
  }
};

/**
 * Get stock history for ready item
 * @param {number} id - Ready item ID
 * @param {string} startDate - Start date (ISO format)
 * @param {string} endDate - End date (ISO format)
 * @returns {Promise} Array of stock history entries
 */
export const getStockHistory = async (id, startDate, endDate) => {
  try {
    const response = await apiService.get(`/api/ready-items/${id}/stock/history`, {
      params: { startDate, endDate }
    });
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching stock history:', error);
    throw error;
  }
};

