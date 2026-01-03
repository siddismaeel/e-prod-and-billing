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
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { createCustomer } from '../../services/customerService';
import { getAllOrganizations } from '../../services/organizationService';
import { getCompaniesByOrganizationId } from '../../services/companyService';

const CreateCustomer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // User role and organization/company state
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);
  const [userOrgId, setUserOrgId] = useState(null);
  const [userCompanyId, setUserCompanyId] = useState(null);

  // Organizations and Companies state
  const [organizations, setOrganizations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    organizationId: '',
    companyId: '',
  });

  // Form validation errors
  const [errors, setErrors] = useState({
    name: '',
    contact: '',
    address: '',
  });

  // Check user role and extract orgId/companyId on component mount
  useEffect(() => {
    const checkUserRoleAndExtractIds = () => {
      try {
        const currentUserStr = localStorage.getItem('currentUser');
        if (!currentUserStr) {
          console.warn('No currentUser found in localStorage');
          return;
        }

        const currentUser = JSON.parse(currentUserStr);
        
        // Check if user has System_Admin role (case insensitive)
        const checkIsSystemAdmin = (user) => {
          if (!user || !user.roles || !Array.isArray(user.roles)) {
            return false;
          }
          return user.roles.some(role => 
            role.name && role.name.toLowerCase().includes('system_admin')
          );
        };

        const isAdmin = checkIsSystemAdmin(currentUser);
        setIsSystemAdmin(isAdmin);

        // Extract orgId and companyId
        const orgId = currentUser?.organizationId || currentUser?.organization?.id || currentUser?.orgId || null;
        const companyId = currentUser?.companyId || currentUser?.company?.id || null;

        setUserOrgId(orgId);
        setUserCompanyId(companyId);

        // If not System_Admin, set formData with orgId and companyId from localStorage
        if (!isAdmin) {
          setFormData(prev => ({
            ...prev,
            organizationId: orgId ? String(orgId) : '',
            companyId: companyId ? String(companyId) : '',
          }));
        }
      } catch (err) {
        console.error('Error parsing currentUser from localStorage:', err);
      }
    };

    checkUserRoleAndExtractIds();
  }, []);

  // Fetch organizations on component mount (only if System_Admin)
  useEffect(() => {
    if (isSystemAdmin) {
      fetchOrganizations();
    } else {
      setLoadingOrganizations(false);
    }
  }, [isSystemAdmin]);

  // Fetch companies when organization changes (only if System_Admin)
  useEffect(() => {
    if (isSystemAdmin && formData.organizationId) {
      fetchCompanies(formData.organizationId);
    } else {
      setCompanies([]);
      if (isSystemAdmin) {
        setFormData((prev) => ({ ...prev, companyId: '' }));
      }
    }
  }, [formData.organizationId, isSystemAdmin]);

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

  // Fetch companies by organization
  const fetchCompanies = async (organizationId) => {
    try {
      setLoadingCompanies(true);
      const data = await getCompaniesByOrganizationId(organizationId);
      setCompanies(data || []);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to load companies. Please try again.');
    } finally {
      setLoadingCompanies(false);
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
      name: '',
      contact: '',
      address: '',
    };

    let isValid = true;

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Validate contact
    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact is required';
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
        name: formData.name.trim(),
        contact: formData.contact.trim(),
        address: formData.address.trim() || null,
        organizationId: formData.organizationId ? Number(formData.organizationId) : null,
        companyId: formData.companyId ? Number(formData.companyId) : null,
      };

      const response = await createCustomer(payload);
      
      setSuccess('Customer created successfully!');
      setFormData({
        name: '',
        contact: '',
        address: '',
        organizationId: '',
        companyId: '',
      });

      // Optionally navigate after a delay
      // setTimeout(() => {
      //   navigate('/customers/list');
      // }, 2000);
    } catch (err) {
      console.error('Error creating customer:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to create customer. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      name: '',
      contact: '',
      address: '',
      organizationId: isSystemAdmin ? '' : (userOrgId ? String(userOrgId) : ''),
      companyId: isSystemAdmin ? '' : (userCompanyId ? String(userCompanyId) : ''),
    });
    setErrors({
      name: '',
      contact: '',
      address: '',
    });
    setError('');
    setSuccess('');
    setCompanies([]);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PeopleIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Create Customer
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Create a new customer by filling in the details below
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Customer Information
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
            {/* Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                disabled={loading}
              />
            </Grid>

            {/* Contact */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                error={!!errors.contact}
                helperText={errors.contact}
                required
                disabled={loading}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
                multiline
                rows={3}
                disabled={loading}
                placeholder="Enter customer address"
              />
            </Grid>

            {/* Organization Selection - Only show for System_Admin */}
            {isSystemAdmin && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.organizationId} disabled={loading || loadingOrganizations}>
                  <InputLabel id="organization-select-label">Organization (Optional)</InputLabel>
                  <Select
                    labelId="organization-select-label"
                    id="organization-select"
                    name="organizationId"
                    value={formData.organizationId}
                    label="Organization (Optional)"
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
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
                </FormControl>
              </Grid>
            )}

            {/* Company Selection - Only show for System_Admin */}
            {isSystemAdmin && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.companyId} disabled={loading || loadingCompanies || !formData.organizationId}>
                  <InputLabel id="company-select-label">Company (Optional)</InputLabel>
                  <Select
                    labelId="company-select-label"
                    id="company-select"
                    name="companyId"
                    value={formData.companyId}
                    label="Company (Optional)"
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {!formData.organizationId ? (
                      <MenuItem disabled>Select an organization first</MenuItem>
                    ) : loadingCompanies ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading companies...
                      </MenuItem>
                    ) : companies.length === 0 ? (
                      <MenuItem disabled>No companies available</MenuItem>
                    ) : (
                      companies.map((company) => (
                        <MenuItem key={company.companyId} value={company.companyId}>
                          {company.companyName || `Company ${company.companyId}`}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
            )}

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
                  {loading ? 'Creating...' : 'Create Customer'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateCustomer;

