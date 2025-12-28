import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance for authentication (no token interceptor)
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Authentication Service
 * Handles login and OTP verification (no Bearer token needed)
 */

/**
 * Login user
 * @param {string} username - Username/email
 * @param {string} password - Password
 * @returns {Promise} API response
 */
export const login = async (username, password) => {
  try {
    console.log('Sending login request...');
    const response = await authApi.post('/authenticate/login', {
      username,
      password,
    });
    console.log('Login Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

/**
 * Verify OTP
 * @param {string} username - Username/email
 * @param {string} password - Password
 * @param {string} otp - OTP code
 * @returns {Promise} API response
 */
export const verifyOtp = async (username, password, otp) => {
  try {
    console.log('Sending OTP verification request...');
    const response = await authApi.post('/authenticate/verify-otp', {
      username,
      password,
      otp,
    });
    
    // Log full response for debugging
    console.log('OTP Verification - Full Response:', response);
    console.log('OTP Verification - Response Data:', response.data);
    console.log('OTP Verification - Response Headers:', response.headers);
    
    // Check for token in response
    if (response.data?.token) {
      console.log('Token found in response.data.token');
    } else if (response.data?.data?.token) {
      console.log('Token found in response.data.data.token');
    } else {
      console.warn('Token not found in expected locations. Full response structure:', response.data);
    }
    
    return response.data;
  } catch (error) {
    console.error('OTP Verification Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });
    throw error;
  }
};


