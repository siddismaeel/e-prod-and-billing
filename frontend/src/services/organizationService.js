import { apiService } from './api';

/**
 * Organization Service
 * Handles all organization-related API calls
 */

/**
 * Create a new organization
 * @param {Object} organizationData - Organization data object
 * @returns {Promise} API response
 */
export const createOrganization = async (organizationData) => {
  try {
    const response = await apiService.post('/org/organization/create', organizationData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get organization by ID
 * @param {number} organizationId - Organization ID
 * @returns {Promise} API response
 */
export const getOrganizationById = async (organizationId) => {
  try {
    const response = await apiService.get(`/org/organization/${organizationId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all organizations
 * @returns {Promise} Organizations array from response.data.data
 */
export const getAllOrganizations = async () => {
  try {
    const response = await apiService.get('/org/organization/all');
    // Handle nested response structure: response.data.data contains the array
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data || [];
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
};


