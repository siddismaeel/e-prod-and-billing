import { apiService } from './api';

/**
 * Role Right Mapping Service
 * Handles all role-right-mapping-related API calls
 */

/**
 * Map role to rights
 * @param {Object} mappingData - Role right mapping data object (RoleRightMappingRequest: { roleId, rights: [{ rightId, map, view, create, update, delete, export, print, approve, reject, cancel }] })
 * @returns {Promise} Mapping response object
 */
export const mapRoleToRights = async (mappingData) => {
  try {
    const response = await apiService.post('/org/role-right-mapping/map', mappingData);
    // Handle response structure: { data: {...}, message: "string", status: "SUCCESS" | "FAILED" }
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error mapping role to rights:', error);
    throw error;
  }
};

/**
 * Get role mappings by role ID
 * @param {number} roleId - Role ID
 * @returns {Promise} Role mappings object
 */
export const getRoleMappings = async (roleId) => {
  try {
    const response = await apiService.get(`/org/role-right-mapping/get-mappings/${roleId}`);
    // Handle response structure: { data: {...}, message: "string", status: "SUCCESS" | "FAILED" }
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching role mappings:', error);
    throw error;
  }
};


