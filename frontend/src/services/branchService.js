import { apiService } from './api';

/**
 * Branch Service
 * Handles all branch-related API calls
 */

/**
 * Create a new branch
 * @param {Object} branchData - Branch data object
 * @param {number} branchData.branchId - Branch ID (0 for creation)
 * @param {string} branchData.branchName - Branch name
 * @param {string} branchData.branchDescription - Branch description
 * @param {string} branchData.type - Branch type
 * @param {number} branchData.countryId - Country ID
 * @param {number} branchData.stateId - State ID
 * @param {number} branchData.cityId - City ID
 * @param {number} branchData.companyId - Company ID
 * @param {string} branchData.address - Address
 * @returns {Promise} API response
 */
export const createBranch = async (branchData) => {
  try {
    const payload = {
      branchId: 0, // Set to 0 for creation
      branchName: branchData.branchName,
      branchDescription: branchData.branchDescription || '',
      type: branchData.type,
      countryId: branchData.countryId,
      stateId: branchData.stateId,
      cityId: branchData.cityId,
      companyId: branchData.companyId,
      address: branchData.address,
    };

    console.log('Creating branch with payload:', payload);
    const response = await apiService.post('/org-setup/branch/create', payload);
    console.log('Branch created successfully:', response.data);
    return response;
  } catch (error) {
    console.error('Error creating branch:', error);
    throw error;
  }
};

/**
 * Get branch by ID
 * @param {number} branchId - Branch ID
 * @returns {Promise} API response
 */
export const getBranchById = async (branchId) => {
  try {
    const response = await apiService.get(`/org-setup/branch/${branchId}`);
    return response;
  } catch (error) {
    console.error('Error fetching branch:', error);
    throw error;
  }
};

/**
 * Get all branches
 * @returns {Promise} API response
 */
export const getAllBranches = async () => {
  try {
    const response = await apiService.get('/org-setup/branch/all');
    return response;
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

/**
 * Get branches by company ID
 * @param {number} companyId - Company ID
 * @returns {Promise} Branches array from response.data.data.branches
 */
export const getBranchesByCompanyId = async (companyId) => {
  try {
    const response = await apiService.get(`/org/branch/get-all-branches-by-company-id/${companyId}`);
    // Handle nested response structure: response.data.data.branches
    if (response.data && response.data.data && response.data.data.branches) {
      return response.data.data.branches;
    }
    return [];
  } catch (error) {
    console.error('Error fetching branches by company:', error);
    throw error;
  }
};

