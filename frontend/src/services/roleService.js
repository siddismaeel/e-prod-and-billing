import { apiService } from './api';

/**
 * Role Service
 * Handles all role-related API calls
 */

/**
 * Get all roles
 * @returns {Promise} Roles array from response
 */
export const getAllRoles = async () => {
  try {
    const response = await apiService.get('/org-setup/role/all');
    // Handle response structure - check if data is nested
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data || [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

/**
 * Get roles by organization ID
 * @param {number} organizationId - Organization ID
 * @returns {Promise} Roles array from response
 */
export const getRolesByOrganizationId = async (organizationId) => {
  try {
    const response = await apiService.get(`/org-setup/role/all-by-organization-id/${organizationId}`);
    // Handle response structure - check if data is nested
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data || [];
  } catch (error) {
    console.error('Error fetching roles by organization:', error);
    throw error;
  }
};

/**
 * Get role by ID
 * @param {number} roleId - Role ID
 * @returns {Promise} API response
 */
export const getRoleById = async (roleId) => {
  try {
    const response = await apiService.get(`/org-setup/role/${roleId}`);
    return response;
  } catch (error) {
    console.error('Error fetching role:', error);
    throw error;
  }
};


