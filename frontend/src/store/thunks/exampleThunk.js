import { createAsyncThunk } from '@reduxjs/toolkit';
import { setLoading, setData, setError } from '../slices/exampleSlice';
import api from '../../services/api';

// Example async thunk for fetching data
export const fetchExampleData = createAsyncThunk(
  'example/fetchData',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await api.get('/example-endpoint', { params });
      dispatch(setData(response.data));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Example async thunk for creating data
export const createExampleData = createAsyncThunk(
  'example/createData',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post('/example-endpoint', data);
      dispatch(setData(response.data));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);


