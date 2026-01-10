import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { saveRight, getRightById } from '../../services/rightService';
import { apiService } from '../../services/api';

const CreateRight = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [loadingRight, setLoadingRight] = useState(isEditMode);
  const [loadingModules, setLoadingModules] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modules dropdown data
  const [modules, setModules] = useState([]);

  const [formData, setFormData] = useState({
    rightId: null,
    rightName: '',
    rightDescription: '',
    moduleId: '',
  });

  // Fetch modules on component mount
  useEffect(() => {
    fetchModules();
  }, []);

  // Fetch right data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchRightData();
    }
  }, [id, isEditMode]);

  const fetchModules = async () => {
    try {
      setLoadingModules(true);
      // Using /org/module/all-module-data based on OpenAPI spec endpoint /module/all-module-data
      const response = await apiService.get('/org/module/all-module-data');
      // Handle response structure: { data: [...], message: "string", status: "SUCCESS" | "FAILED" }
      const modulesData = response.data?.data || response.data || [];
      setModules(modulesData);
    } catch (err) {
      console.error('Error fetching modules:', err);
      setError('Failed to load modules. Please refresh the page.');
    } finally {
      setLoadingModules(false);
    }
  };

  const fetchRightData = async () => {
    try {
      setLoadingRight(true);
      setError('');
      const rightData = await getRightById(Number(id));
      
      // Handle response structure - rightData might be nested
      const right = rightData?.data || rightData;
      
      if (right) {
        setFormData({
          rightId: right.rightId || right.id || null,
          rightName: right.rightName || right.name || '',
          rightDescription: right.rightDescription || right.description || '',
          moduleId: right.moduleId || right.module?.id || '',
        });
      }
    } catch (err) {
      console.error('Error fetching right:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch right data');
    } finally {
      setLoadingRight(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.rightName.trim()) {
      setError('Right name is required');
      return false;
    }
    if (!formData.moduleId) {
      setError('Module is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Prepare payload - exclude rightId if creating new
      const payload = {
        rightName: formData.rightName.trim(),
        rightDescription: formData.rightDescription.trim(),
        moduleId: Number(formData.moduleId),
      };

      // Include rightId only if in edit mode
      if (isEditMode && formData.rightId) {
        payload.rightId = formData.rightId;
      }

      const savedRight = await saveRight(payload);
      
      setSuccess(isEditMode ? 'Right updated successfully!' : 'Right created successfully!');
      
      // Navigate to list page after 1.5 seconds
      setTimeout(() => {
        navigate('/rights/list');
      }, 1500);
    } catch (err) {
      console.error('Error saving right:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save right');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      rightId: isEditMode ? formData.rightId : null,
      rightName: '',
      rightDescription: '',
      moduleId: '',
    });
    setError('');
    setSuccess('');
  };

  if (loadingRight || loadingModules) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SecurityIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            {isEditMode ? 'Edit Right' : 'Create Right'}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {isEditMode ? 'Update right/permission information' : 'Create a new right/permission'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
                Right Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Right Name"
                name="rightName"
                value={formData.rightName}
                onChange={handleChange}
                required
                placeholder="Enter right name"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="module-select-label">Module</InputLabel>
                <Select
                  labelId="module-select-label"
                  id="module-select"
                  name="moduleId"
                  value={formData.moduleId}
                  label="Module"
                  onChange={handleChange}
                  disabled={loadingModules}
                >
                  <MenuItem value="">
                    <em>Select Module</em>
                  </MenuItem>
                  {loadingModules ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading modules...
                    </MenuItem>
                  ) : modules.length === 0 ? (
                    <MenuItem disabled>No modules available</MenuItem>
                  ) : (
                    modules.map((module) => (
                      <MenuItem key={module.moduleId || module.id} value={module.moduleId || module.id}>
                        {module.moduleName || module.name || `Module ${module.moduleId || module.id}`}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="rightDescription"
                value={formData.rightDescription}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Enter right description"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleReset}
                  disabled={loading}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : isEditMode ? 'Update Right' : 'Create Right'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateRight;
