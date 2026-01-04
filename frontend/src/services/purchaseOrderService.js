import { apiService } from './api';

/**
 * Purchase Order Service
 * Handles all purchase order-related API calls
 */

/**
 * Get all purchase orders
 * @returns {Promise} Array of purchase orders
 */
export const getAllPurchaseOrders = async () => {
  try {
    const response = await apiService.get('/billing/api/purchase-orders');
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    throw error;
  }
};

/**
 * Get purchase order by ID
 * @param {number} id - Purchase order ID
 * @returns {Promise} Purchase order object
 */
export const getPurchaseOrderById = async (id) => {
  try {
    const response = await apiService.get(`/billing/api/purchase-orders/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching purchase order:', error);
    throw error;
  }
};

/**
 * Create or update purchase order
 * @param {Object} purchaseOrderData - Purchase order data object
 * @returns {Promise} API response
 */
export const upsertPurchaseOrder = async (purchaseOrderData) => {
  try {
    const response = await apiService.post('/billing/api/purchase-orders', purchaseOrderData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error upserting purchase order:', error);
    throw error;
  }
};

/**
 * Delete purchase order
 * @param {number} id - Purchase order ID
 * @returns {Promise} API response
 */
export const deletePurchaseOrder = async (id) => {
  try {
    const response = await apiService.delete(`/billing/api/purchase-orders/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting purchase order:', error);
    throw error;
  }
};


