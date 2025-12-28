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
import BusinessIcon from '@mui/icons-material/Business';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { createDepartment } from '../../services/departmentService';
import { getAllOrganizations } from '../../services/organizationService';
import { getCompaniesByOrganizationId } from '../../services/companyService';
import { getBranchesByCompanyId } from '../../services/branchService';

const CreateDepartment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dropdown data state
  const [organizations, setOrganizations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);

  // Loading states
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    organizationId: '',
    companyId: '',
    branchId: '',
    departmentName: '',
    description: '',
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Fetch organizations on component mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Fetch companies when organization is selected
  useEffect(() => {
    if (formData.organizationId) {
      fetchCompanies(formData.organizationId);
      setFormData((prev) => ({ ...prev, companyId: '', branchId: '' }));
      setCompanies([]);
      setBranches([]);
    } else {
      setCompanies([]);
      setBranches([]);
      setFormData((prev) => ({ ...prev, companyId: '', branchId: '' }));
    }
  }, [formData.organizationId]);

  // Fetch branches when company is selected
  useEffect(() => {
    if (formData.companyId) {
      fetchBranches(formData.companyId);
      setFormData((prev) => ({ ...prev, branchId: '' }));
      setBranches([]);
    } else {
      setBranches([]);
      setFormData((prev) => ({ ...prev, branchId: '' }));
    }
  }, [formData.companyId]);

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

  const fetchCompanies = async (organizationId) => {
    try {
      setLoadingCompanies(true);
      const data = await getCompaniesByOrganizationId(organizationId);
      setCompanies(data || []);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to load companies. Please try again.');
      setCompanies([]);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const fetchBranches = async (companyId) => {
    try {
      setLoadingBranches(true);
      const data = await getBranchesByCompanyId(companyId);
      setBranches(data || []);
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError('Failed to load branches. Please try again.');
      setBranches([]);
    } finally {
      setLoadingBranches(false);
    }
  };

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

  const handleOrganizationChange = (e) => {
    const organizationId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      organizationId,
      companyId: '',
      branchId: '',
    }));
    setErrors((prev) => ({
      ...prev,
      organizationId: '',
      companyId: '',
      branchId: '',
    }));
  };

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      companyId,
      branchId: '',
    }));
    setErrors((prev) => ({
      ...prev,
      companyId: '',
      branchId: '',
    }));
  };

  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      branchId,
    }));
    if (errors.branchId) {
      setErrors((prev) => ({
        ...prev,
        branchId: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.organizationId) {
      newErrors.organizationId = 'Organization is required';
    }

    if (!formData.companyId) {
      newErrors.companyId = 'Company is required';
    }

    if (!formData.branchId) {
      newErrors.branchId = 'Branch is required';
    }

    if (!formData.departmentName.trim()) {
      newErrors.departmentName = 'Department name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        departmentId: 0,
        departmentName: formData.departmentName.trim(),
        companyId: Number(formData.companyId),
        branchId: Number(formData.branchId),
        description: formData.description.trim() || '',
      };

      const response = await createDepartment(payload);
      setSuccess('Department created successfully!');
      handleReset();
    } catch (err) {
      console.error('Error creating department:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to create department. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      organizationId: '',
      companyId: '',
      branchId: '',
      departmentName: '',
      description: '',
    });
    setCompanies([]);
    setBranches([]);
    setErrors({});
    setError('');
    setSuccess('');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BusinessIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Create Department
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Create a new department by filling in the details below
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Department Information
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
                  onChange={handleOrganizationChange}
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

            {/* Company Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.companyId} disabled={loading || loadingCompanies || !formData.organizationId}>
                <InputLabel id="company-select-label">Company</InputLabel>
                <Select
                  labelId="company-select-label"
                  id="company-select"
                  name="companyId"
                  value={formData.companyId}
                  label="Company"
                  onChange={handleCompanyChange}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected || selected === '') {
                      return <em>Select a company</em>;
                    }
                    const company = companies.find((c) => String(c.companyId) === String(selected));
                    return company ? (company.companyName || `Company ${company.companyId}`) : selected;
                  }}
                >
                  {!formData.organizationId ? (
                    <MenuItem value="" disabled>
                      Please select an organization first
                    </MenuItem>
                  ) : loadingCompanies ? (
                    <MenuItem value="" disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading companies...
                    </MenuItem>
                  ) : companies.length === 0 ? (
                    <MenuItem value="" disabled>
                      No companies available for this organization
                    </MenuItem>
                  ) : (
                    companies.map((company) => {
                      const companyIdStr = String(company.companyId);
                      return (
                        <MenuItem key={company.companyId} value={companyIdStr}>
                          {company.companyName || `Company ${company.companyId}`}
                        </MenuItem>
                      );
                    })
                  )}
                </Select>
                {errors.companyId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.companyId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Branch Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.branchId} disabled={loading || loadingBranches || !formData.companyId}>
                <InputLabel id="branch-select-label">Branch</InputLabel>
                <Select
                  labelId="branch-select-label"
                  id="branch-select"
                  name="branchId"
                  value={formData.branchId}
                  label="Branch"
                  onChange={handleBranchChange}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected || selected === '') {
                      return <em>Select a branch</em>;
                    }
                    const branch = branches.find((b) => String(b.branchId) === String(selected));
                    return branch ? (branch.branchName || `Branch ${branch.branchId}`) : selected;
                  }}
                >
                  {!formData.companyId ? (
                    <MenuItem value="" disabled>
                      Please select a company first
                    </MenuItem>
                  ) : loadingBranches ? (
                    <MenuItem value="" disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading branches...
                    </MenuItem>
                  ) : branches.length === 0 ? (
                    <MenuItem value="" disabled>
                      No branches available for this company
                    </MenuItem>
                  ) : (
                    branches.map((branch) => {
                      const branchIdStr = String(branch.branchId);
                      return (
                        <MenuItem key={branch.branchId} value={branchIdStr}>
                          {branch.branchName || `Branch ${branch.branchId}`}
                        </MenuItem>
                      );
                    })
                  )}
                </Select>
                {errors.branchId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.branchId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Department Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department Name"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleChange}
                error={!!errors.departmentName}
                helperText={errors.departmentName}
                required
                disabled={loading}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                multiline
                rows={3}
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
                  {loading ? 'Creating...' : 'Create Department'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateDepartment;
