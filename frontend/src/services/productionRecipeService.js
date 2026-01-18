import { apiService } from './api';

/**
 * Production Recipe Service
 * Handles all production recipe-related API calls
 */

/**
 * Create or update production recipe
 * @param {Object} recipeData - Recipe data object
 * @returns {Promise} API response
 */
export const upsertRecipe = async (recipeData) => {
  try {
    const response = await apiService.post('/billing/api/production-recipes', recipeData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error upserting recipe:', error);
    throw error;
  }
};

/**
 * Get recipes by ready item
 * @param {number} readyItemId - Ready item ID
 * @returns {Promise} Array of recipes
 */
export const getRecipesByReadyItem = async (readyItemId) => {
  try {
    const response = await apiService.get(`/billing/api/production-recipes/ready-item/${readyItemId}`);
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching recipes by ready item:', error);
    throw error;
  }
};

/**
 * Get recipes by ready item and quality
 * @param {number} readyItemId - Ready item ID
 * @param {string} quality - Quality string
 * @returns {Promise} Array of recipes
 */
export const getRecipesByQuality = async (readyItemId, quality) => {
  try {
    const response = await apiService.get(`/billing/api/production-recipes/ready-item/${readyItemId}/quality/${quality}`);
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching recipes by quality:', error);
    throw error;
  }
};

/**
 * Get recipes by raw material
 * @param {number} rawMaterialId - Raw material ID
 * @returns {Promise} Array of recipes
 */
export const getRecipesByRawMaterial = async (rawMaterialId) => {
  try {
    const response = await apiService.get(`/billing/api/production-recipes/raw-material/${rawMaterialId}`);
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching recipes by raw material:', error);
    throw error;
  }
};

/**
 * Calculate required materials for production
 * @param {number} readyItemId - Ready item ID
 * @param {string} quality - Quality string
 * @param {number} quantity - Quantity to produce
 * @returns {Promise} Map of material IDs to required quantities
 */
export const calculateRequiredMaterials = async (readyItemId, quality, quantity) => {
  try {
    const response = await apiService.get(
      `/billing/api/production-recipes/ready-item/${readyItemId}/quality/${quality}/calculate`,
      { params: { quantity } }
    );
    return response.data?.data || response.data || {};
  } catch (error) {
    console.error('Error calculating required materials:', error);
    throw error;
  }
};



