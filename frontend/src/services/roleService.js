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
    const response = await apiService.get('/org/role/all');
    // Handle response structure: { data: [...], message: "string", status: "SUCCESS" | "FAILED" }
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
 * @returns {Promise} Role object
 */
export const getRoleById = async (roleId) => {
  try {
    const response = await apiService.get(`/org/role/${roleId}`);
    // Handle response structure: { data: {...}, message: "string", status: "SUCCESS" | "FAILED" }
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching role:', error);
    throw error;
  }
};

/**
 * Create or update role
 * @param {Object} roleData - Role data object (RoleRequest: { roleId?, roleName, priority, description })
 * @returns {Promise} Role object from response
 */
export const saveRole = async (roleData) => {
  try {
    const response = await apiService.post('/org/role/save', roleData);
    // Handle response structure: { data: {...}, message: "string", status: "SUCCESS" | "FAILED" }
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error saving role:', error);
    throw error;
  }
};

/**
 * Delete role
 * @param {number} roleId - Role ID
 * @returns {Promise} API response
 */
export const deleteRole = async (roleId) => {
  try {
    const response = await apiService.delete(`/org/role/delete/${roleId}`);
    return response;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};



