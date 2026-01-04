import { apiService } from './api';

/**
 * Material Consumption Service
 * Handles all material consumption-related API calls
 */

/**
 * Record manual material consumption
 * @param {Object} consumptionData - Material consumption data object
 * @returns {Promise} API response
 */
export const recordManualConsumption = async (consumptionData) => {
  try {
    const response = await apiService.post('/api/material-consumptions/manual', consumptionData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error recording material consumption:', error);
    throw error;
  }
};

/**
 * Get material consumptions
 * @param {number} rawMaterialId - Raw material ID (optional)
 * @param {string} startDate - Start date (ISO format, optional)
 * @param {string} endDate - End date (ISO format, optional)
 * @returns {Promise} Array of material consumptions
 */
export const getConsumptions = async (rawMaterialId = null, startDate = null, endDate = null) => {
  try {
    const params = {};
    if (rawMaterialId) params.rawMaterialId = rawMaterialId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await apiService.get('/api/material-consumptions', { params });
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching material consumptions:', error);
    throw error;
  }
};


