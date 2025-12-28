import { apiService } from './api';

/**
 * Company Service
 * Handles all company-related API calls
 */

/**
 * Create a new company
 * @param {Object} companyData - Company data object
 * @param {number} companyData.companyId - Company ID (0 for creation)
 * @param {string} companyData.companyName - Company name
 * @param {string} companyData.logo - Logo URL (optional)
 * @param {number} companyData.organizationId - Organization ID
 * @returns {Promise} API response
 */
export const createCompany = async (companyData) => {
  try {
    // Ensure companyId is 0 for creation
    const payload = {
      companyId: 0,
      companyName: companyData.companyName,
      logo: companyData.logo || '',
      organizationId: companyData.organizationId,
    };
    
    console.log('Creating company with payload:', payload);
    const response = await apiService.post('/org-setup/company/create', payload);
    console.log('Company created successfully:', response.data);
    return response;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

/**
 * Get company by ID
 * @param {number} companyId - Company ID
 * @returns {Promise} API response
 */
export const getCompanyById = async (companyId) => {
  try {
    const response = await apiService.get(`/org-setup/company/${companyId}`);
    return response;
  } catch (error) {
    console.error('Error fetching company:', error);
    throw error;
  }
};

/**
 * Get all companies
 * @returns {Promise} API response
 */
export const getAllCompanies = async () => {
  try {
    const response = await apiService.get('/org-setup/company/all');
    return response;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

/**
 * Get companies by organization ID
 * @param {number} organizationId - Organization ID
 * @returns {Promise} Companies array from response
 */
export const getCompaniesByOrganizationId = async (organizationId) => {
  try {
    const response = await apiService.get(`/org-setup/company/all/${organizationId}`);
    // Handle response structure - check if data is nested
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data || [];
  } catch (error) {
    console.error('Error fetching companies by organization:', error);
    throw error;
  }
};

