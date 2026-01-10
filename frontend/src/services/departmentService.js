import { apiService } from './api';

/**
 * Department Service
 * Handles all department-related API calls
 */

/**
 * Create a new department
 * @param {Object} departmentData - Department data object
 * @param {number} departmentData.departmentId - Department ID (0 for creation)
 * @param {string} departmentData.departmentName - Department name
 * @param {number} departmentData.companyId - Company ID
 * @param {number} departmentData.branchId - Branch ID
 * @param {string} departmentData.description - Description (optional)
 * @returns {Promise} API response
 */
export const createDepartment = async (departmentData) => {
  try {
    const payload = {
      departmentId: 0, // Set to 0 for creation
      departmentName: departmentData.departmentName,
      companyId: departmentData.companyId,
      branchId: departmentData.branchId,
      description: departmentData.description || '',
    };

    console.log('Creating department with payload:', payload);
    const response = await apiService.post('/org/department/create', payload);
    console.log('Department created successfully:', response.data);
    return response;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

/**
 * Get departments by organization ID
 * @param {number} organizationId - Organization ID
 * @returns {Promise} Departments array from response
 */
export const getDepartmentsByOrganizationId = async (organizationId) => {
  try {
    const response = await apiService.get(`/org/department/all-by-organization-id/${organizationId}`);
    // Handle response structure: { data: { organizationId, departments: [...] }, message, status }
    if (response.data && response.data.data) {
      // Check if data.data is an object with departments array
      if (response.data.data.departments && Array.isArray(response.data.data.departments)) {
        return response.data.data.departments;
      }
      // If data.data is already an array, return it
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }
    }
    // Fallback: check if response.data is an array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching departments by organization:', error);
    throw error;
  }
};

/**
 * Get department by ID
 * @param {number} departmentId - Department ID
 * @returns {Promise} API response
 */
export const getDepartmentById = async (departmentId) => {
  try {
    const response = await apiService.get(`/org/department/${departmentId}`);
    return response;
  } catch (error) {
    console.error('Error fetching department:', error);
    throw error;
  }
};

/**
 * Get all departments
 * @returns {Promise} API response
 */
export const getAllDepartments = async () => {
  try {
    const response = await apiService.get('/org/department/all');
    return response;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

