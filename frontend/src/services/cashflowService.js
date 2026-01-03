import { apiService } from './api';

/**
 * Cashflow Service
 * Handles all cashflow-related API calls
 */

/**
 * Get cashflow
 * @param {string} startDate - Start date (ISO format, optional)
 * @param {string} endDate - End date (ISO format, optional)
 * @returns {Promise} Array of cashflow entries
 */
export const getCashFlow = async (startDate = null, endDate = null) => {
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await apiService.get('/api/cashflow', { params });
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching cashflow:', error);
    throw error;
  }
};

/**
 * Record cash entry
 * @param {Object} cashData - Cash entry data object
 * @returns {Promise} API response
 */
export const recordCashEntry = async (cashData) => {
  try {
    const response = await apiService.post('/api/cashflow', cashData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error recording cash entry:', error);
    throw error;
  }
};

