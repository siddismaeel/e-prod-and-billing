import { apiService } from './api';

/**
 * Sales Order Service
 * Handles all sales order-related API calls
 */

/**
 * Get all sales orders
 * @returns {Promise} Array of sales orders
 */
export const getAllSalesOrders = async () => {
  try {
    const response = await apiService.get('/api/sales-orders');
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching sales orders:', error);
    throw error;
  }
};

/**
 * Get sales order by ID
 * @param {number} id - Sales order ID
 * @returns {Promise} Sales order object
 */
export const getSalesOrderById = async (id) => {
  try {
    const response = await apiService.get(`/api/sales-orders/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching sales order:', error);
    throw error;
  }
};

/**
 * Create or update sales order
 * @param {Object} salesOrderData - Sales order data object
 * @returns {Promise} API response
 */
export const upsertSalesOrder = async (salesOrderData) => {
  try {
    const response = await apiService.post('/api/sales-orders', salesOrderData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error upserting sales order:', error);
    throw error;
  }
};

/**
 * Delete sales order
 * @param {number} id - Sales order ID
 * @returns {Promise} API response
 */
export const deleteSalesOrder = async (id) => {
  try {
    const response = await apiService.delete(`/api/sales-orders/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting sales order:', error);
    throw error;
  }
};

