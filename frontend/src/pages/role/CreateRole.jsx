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
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { saveRole, getRoleById } from '../../services/roleService';

const CreateRole = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [loadingRole, setLoadingRole] = useState(isEditMode);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    roleId: null,
    roleName: '',
    priority: 0,
    description: '',
  });

  // Fetch role data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchRoleData();
    }
  }, [id, isEditMode]);

  const fetchRoleData = async () => {
    try {
      setLoadingRole(true);
      setError('');
      const roleData = await getRoleById(Number(id));
      
      // Handle response structure - roleData might be nested
      const role = roleData?.data || roleData;
      
      if (role) {
        setFormData({
          roleId: role.roleId || role.id || null,
          roleName: role.roleName || role.name || '',
          priority: role.priority || 0,
          description: role.description || '',
        });
      }
    } catch (err) {
      console.error('Error fetching role:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch role data');
    } finally {
      setLoadingRole(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'priority' ? (value === '' ? 0 : Number(value)) : value,
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.roleName.trim()) {
      setError('Role name is required');
      return false;
    }
    if (formData.priority < 0) {
      setError('Priority must be a non-negative number');
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

      // Prepare payload - exclude roleId if creating new
      const payload = {
        roleName: formData.roleName.trim(),
        priority: formData.priority,
        description: formData.description.trim(),
      };

      // Include roleId only if in edit mode
      if (isEditMode && formData.roleId) {
        payload.roleId = formData.roleId;
      }

      const savedRole = await saveRole(payload);
      
      setSuccess(isEditMode ? 'Role updated successfully!' : 'Role created successfully!');
      
      // Navigate to list page after 1.5 seconds
      setTimeout(() => {
        navigate('/roles/list');
      }, 1500);
    } catch (err) {
      console.error('Error saving role:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save role');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      roleId: isEditMode ? formData.roleId : null,
      roleName: '',
      priority: 0,
      description: '',
    });
    setError('');
    setSuccess('');
  };

  if (loadingRole) {
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
          <BadgeIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            {isEditMode ? 'Edit Role' : 'Create Role'}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {isEditMode ? 'Update role information' : 'Create a new role'}
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
                Role Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Role Name"
                name="roleName"
                value={formData.roleName}
                onChange={handleChange}
                required
                placeholder="Enter role name"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Priority"
                name="priority"
                type="number"
                value={formData.priority}
                onChange={handleChange}
                required
                inputProps={{ min: 0 }}
                placeholder="Enter priority"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Enter role description"
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
                  {loading ? 'Saving...' : isEditMode ? 'Update Role' : 'Create Role'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateRole;
