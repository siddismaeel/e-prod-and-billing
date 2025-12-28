import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import DomainIcon from '@mui/icons-material/Domain';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { createCompany } from '../../services/companyService';
import { getAllOrganizations } from '../../services/organizationService';

const CreateCompany = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Organizations state
  const [organizations, setOrganizations] = useState([]);
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    companyName: '',
    logo: '',
    organizationId: '',
  });

  // Form validation errors
  const [errors, setErrors] = useState({
    companyName: '',
    organizationId: '',
  });

  // Fetch organizations on component mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Fetch organizations
  const fetchOrganizations = async () => {
    try {
      setLoadingOrganizations(true);
      const data = await getAllOrganizations();
      setOrganizations(data || []);
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError('Failed to load organizations. Please refresh the page.');
    } finally {
      setLoadingOrganizations(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    // Clear success message when user starts typing
    if (success) {
      setSuccess('');
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      companyName: '',
      organizationId: '',
    };

    let isValid = true;

    // Validate company name
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
      isValid = false;
    }

    // Validate organization ID
    if (!formData.organizationId) {
      newErrors.organizationId = 'Please select an organization';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        companyName: formData.companyName.trim(),
        logo: formData.logo.trim() || '',
        organizationId: Number(formData.organizationId),
      };

      const response = await createCompany(payload);
      
      setSuccess('Company created successfully!');
      setFormData({
        companyName: '',
        logo: '',
        organizationId: '',
      });

      // Optionally navigate after a delay
      // setTimeout(() => {
      //   navigate('/companies/list');
      // }, 2000);
    } catch (err) {
      console.error('Error creating company:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to create company. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      companyName: '',
      logo: '',
      organizationId: '',
    });
    setErrors({
      companyName: '',
      organizationId: '',
    });
    setError('');
    setSuccess('');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <DomainIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Create Company
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Create a new company by filling in the details below
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Company Information
        </Typography>

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

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Company Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                error={!!errors.companyName}
                helperText={errors.companyName}
                required
                disabled={loading}
              />
            </Grid>

            {/* Organization Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.organizationId} disabled={loading || loadingOrganizations}>
                <InputLabel id="organization-select-label">Organization</InputLabel>
                <Select
                  labelId="organization-select-label"
                  id="organization-select"
                  name="organizationId"
                  value={formData.organizationId}
                  label="Organization"
                  onChange={handleChange}
                >
                  {loadingOrganizations ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading organizations...
                    </MenuItem>
                  ) : organizations.length === 0 ? (
                    <MenuItem disabled>No organizations available</MenuItem>
                  ) : (
                    organizations.map((org) => (
                      <MenuItem key={org.organizationId} value={org.organizationId}>
                        {org.name || `Organization ${org.organizationId}`}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.organizationId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.organizationId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Logo URL */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Logo URL"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                helperText="Optional: Enter the URL for the company logo"
                disabled={loading}
                placeholder="https://example.com/logo.png"
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ClearIcon />}
                  onClick={handleReset}
                  disabled={loading}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Company'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateCompany;
