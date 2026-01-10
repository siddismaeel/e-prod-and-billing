import { apiService } from './api';

/**
 * Raw Material Stock Service
 * Handles all raw material stock-related API calls
 */

/**
 * Get current stock for raw material
 * @param {number} id - Raw material ID
 * @returns {Promise} Current stock quantity
 */
export const getCurrentStock = async (id) => {
  try {
    const response = await apiService.get(`/api/raw-materials/${id}/stock/current`);
    return response.data?.data || response.data || 0;
  } catch (error) {
    console.error('Error fetching current stock:', error);
    throw error;
  }
};

/**
 * Get stock by date for raw material
 * @param {number} id - Raw material ID
 * @param {string} date - Date (ISO format)
 * @returns {Promise} Stock data object
 */
export const getStockByDate = async (id, date) => {
  try {
    const response = await apiService.get(`/api/raw-materials/${id}/stock`, {
      params: { date }
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching stock by date:', error);
    throw error;
  }
};

/**
 * Get stock history for raw material
 * @param {number} id - Raw material ID
 * @param {string} startDate - Start date (ISO format)
 * @param {string} endDate - End date (ISO format)
 * @returns {Promise} Array of stock history entries
 */
export const getStockHistory = async (id, startDate, endDate) => {
  try {
    const response = await apiService.get(`/api/raw-materials/${id}/stock/history`, {
      params: { startDate, endDate }
    });
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching stock history:', error);
    throw error;
  }
};

/**
 * Adjust stock for raw material
 * @param {number} id - Raw material ID
 * @param {Object} adjustmentData - Stock adjustment data object
 * @returns {Promise} Updated stock data object
 */
export const adjustStock = async (id, adjustmentData) => {
  try {
    const response = await apiService.post(`/api/raw-materials/${id}/stock/adjust`, adjustmentData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error adjusting stock:', error);
    throw error;
  }
};



