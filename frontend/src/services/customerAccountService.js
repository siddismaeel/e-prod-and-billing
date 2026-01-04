import { apiService } from './api';

/**
 * Customer Account Service
 * Handles all customer account-related API calls
 */

/**
 * Get customer account
 * @param {number} customerId - Customer ID
 * @returns {Promise} Customer account object
 */
export const getAccount = async (customerId) => {
  try {
    const response = await apiService.get(`/billing/api/customer-accounts/${customerId}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching customer account:', error);
    throw error;
  }
};

/**
 * Get account statement
 * @param {number} customerId - Customer ID
 * @param {string} startDate - Start date (ISO format, optional)
 * @param {string} endDate - End date (ISO format, optional)
 * @returns {Promise} Account statement object
 */
export const getAccountStatement = async (customerId, startDate = null, endDate = null) => {
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await apiService.get(`/billing/api/customer-accounts/${customerId}/statement`, { params });
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching account statement:', error);
    throw error;
  }
};

/**
 * Recalculate customer account balance
 * @param {number} customerId - Customer ID
 * @returns {Promise} Updated customer account object
 */
export const recalculateBalance = async (customerId) => {
  try {
    const response = await apiService.post(`/billing/api/customer-accounts/${customerId}/recalculate`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error recalculating balance:', error);
    throw error;
  }
};

/**
 * Get payment history for customer
 * @param {number} customerId - Customer ID
 * @returns {Promise} Array of payment transactions
 */
export const getPaymentHistory = async (customerId) => {
  try {
    const response = await apiService.get(`/billing/api/customer-accounts/${customerId}/transactions`);
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};


