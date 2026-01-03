import { apiService } from './api';

/**
 * Raw Material Service
 * Handles all raw material-related API calls
 */

/**
 * Get all raw materials
 * @returns {Promise} Array of raw materials
 */
export const getAllRawMaterials = async () => {
  try {
    const response = await apiService.get('/api/raw-materials');
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching raw materials:', error);
    throw error;
  }
};

/**
 * Get raw material by ID
 * @param {number} id - Raw material ID
 * @returns {Promise} Raw material object
 */
export const getRawMaterialById = async (id) => {
  try {
    const response = await apiService.get(`/api/raw-materials/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching raw material:', error);
    throw error;
  }
};

/**
 * Create or update raw material
 * @param {Object} rawMaterialData - Raw material data object
 * @returns {Promise} API response
 */
export const upsertRawMaterial = async (rawMaterialData) => {
  try {
    const response = await apiService.post('/api/raw-materials', rawMaterialData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error upserting raw material:', error);
    throw error;
  }
};

