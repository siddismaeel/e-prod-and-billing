import { apiService } from './api';

/**
 * Proposition Service
 * Handles all proposition-related API calls
 */

/**
 * Create or update proposition
 * @param {Object} propositionData - Proposition data object
 * @returns {Promise} API response
 */
export const upsertProposition = async (propositionData) => {
  try {
    const response = await apiService.post('/api/propositions', propositionData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error upserting proposition:', error);
    throw error;
  }
};

/**
 * Get propositions by ready item
 * @param {number} readyItemId - Ready item ID
 * @returns {Promise} Array of propositions
 */
export const getPropositionsByReadyItem = async (readyItemId) => {
  try {
    const response = await apiService.get(`/api/propositions/ready-item/${readyItemId}`);
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching propositions by ready item:', error);
    throw error;
  }
};

/**
 * Validate propositions for ready item
 * @param {number} readyItemId - Ready item ID
 * @returns {Promise} Validation result object
 */
export const validatePropositions = async (readyItemId) => {
  try {
    const response = await apiService.get(`/api/propositions/ready-item/${readyItemId}/validate`);
    return response.data?.data || response.data || {};
  } catch (error) {
    console.error('Error validating propositions:', error);
    throw error;
  }
};


