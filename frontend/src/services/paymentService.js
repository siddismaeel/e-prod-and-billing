import { apiService } from './api';

/**
 * Payment Service
 * Handles all payment-related API calls
 */

/**
 * Record payment
 * @param {Object} paymentData - Payment data object
 * @returns {Promise} API response
 */
export const recordPayment = async (paymentData) => {
  try {
    const response = await apiService.post('/api/payments', paymentData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error recording payment:', error);
    throw error;
  }
};

/**
 * Update payment
 * @param {number} id - Payment ID
 * @param {Object} paymentData - Payment data object
 * @returns {Promise} API response
 */
export const updatePayment = async (id, paymentData) => {
  try {
    const response = await apiService.put(`/api/payments/${id}`, paymentData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error updating payment:', error);
    throw error;
  }
};

/**
 * Delete payment
 * @param {number} id - Payment ID
 * @returns {Promise} API response
 */
export const deletePayment = async (id) => {
  try {
    const response = await apiService.delete(`/api/payments/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting payment:', error);
    throw error;
  }
};

/**
 * Get payments by customer
 * @param {number} customerId - Customer ID
 * @returns {Promise} Array of payments
 */
export const getPaymentsByCustomer = async (customerId) => {
  try {
    const response = await apiService.get(`/api/payments/customer/${customerId}`);
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching payments by customer:', error);
    throw error;
  }
};

/**
 * Get payments by order
 * @param {number} orderId - Order ID
 * @param {string} orderType - Order type (e.g., 'SALES', 'PURCHASE')
 * @returns {Promise} Array of payments
 */
export const getPaymentsByOrder = async (orderId, orderType) => {
  try {
    const response = await apiService.get(`/api/payments/order/${orderId}`, {
      params: { orderType }
    });
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching payments by order:', error);
    throw error;
  }
};

