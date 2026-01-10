import { apiService } from './api';

/**
 * Right Service
 * Handles all right-related API calls
 */

/**
 * Get all rights
 * @returns {Promise} Rights array from response
 */
export const getAllRights = async () => {
  try {
    const response = await apiService.get('/org/right/all');
    // Handle response structure: { data: [...], message: "string", status: "SUCCESS" | "FAILED" }
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data || [];
  } catch (error) {
    console.error('Error fetching rights:', error);
    throw error;
  }
};

/**
 * Get right by ID
 * @param {number} id - Right ID
 * @returns {Promise} Right object
 */
export const getRightById = async (id) => {
  try {
    const response = await apiService.get(`/org/right/${id}`);
    // Handle response structure: { data: {...}, message: "string", status: "SUCCESS" | "FAILED" }
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching right:', error);
    throw error;
  }
};

/**
 * Create or update right
 * @param {Object} rightData - Right data object (RightDto: { rightName (required), rightDescription, rightId?, moduleId (required) })
 * @returns {Promise} Right object from response
 */
export const saveRight = async (rightData) => {
  try {
    const response = await apiService.post('/org/right/save', rightData);
    // Handle response structure: { data: {...}, message: "string", status: "SUCCESS" | "FAILED" }
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error saving right:', error);
    throw error;
  }
};

/**
 * Delete right
 * @param {number} id - Right ID
 * @returns {Promise} API response
 */
export const deleteRight = async (id) => {
  try {
    const response = await apiService.delete(`/org/right/delete/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting right:', error);
    throw error;
  }
};


