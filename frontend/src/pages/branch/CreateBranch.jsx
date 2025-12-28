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
  Autocomplete,
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { createBranch } from '../../services/branchService';
import { getAllOrganizations } from '../../services/organizationService';
import { getCompaniesByOrganizationId } from '../../services/companyService';
import {
  getAllCountries,
  getStatesByCountry,
  getCitiesByState,
} from '../../services/addressService';

const CreateBranch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dropdown data state
  const [organizations, setOrganizations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Loading states
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Selected objects for Autocomplete
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    organizationId: '',
    companyId: '',
    branchName: '',
    type: '',
    countryId: 0,
    stateId: 0,
    cityId: 0,
    address: '',
    branchDescription: '',
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Fetch organizations on component mount
  useEffect(() => {
    fetchOrganizations();
    fetchCountries();
  }, []);

  // Fetch companies when organization is selected
  useEffect(() => {
    if (formData.organizationId) {
      fetchCompanies(formData.organizationId);
    } else {
      setCompanies([]);
      setFormData((prev) => ({ ...prev, companyId: '' }));
    }
  }, [formData.organizationId]);

  // Fetch states when country is selected
  useEffect(() => {
    if (formData.countryId && formData.countryId > 0) {
      fetchStates(formData.countryId);
    } else {
      setStates([]);
      setCities([]);
      setSelectedState(null);
      setSelectedCity(null);
      setFormData((prev) => ({ ...prev, stateId: 0, cityId: 0 }));
    }
  }, [formData.countryId]);

  // Fetch cities when state is selected
  useEffect(() => {
    if (formData.stateId && formData.stateId > 0) {
      fetchCities(formData.stateId);
    } else {
      setCities([]);
      setSelectedCity(null);
      setFormData((prev) => ({ ...prev, cityId: 0 }));
    }
  }, [formData.stateId]);

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
    } finally {
      setLoadingCompanies(false);
    }
  };

  const fetchCountries = async () => {
    try {
      setLoadingCountries(true);
      const data = await getAllCountries();
      const countriesList = Array.isArray(data) ? data : data?.data || data?.countries || [];
      setCountries(countriesList);
    } catch (err) {
      console.error('Failed to fetch countries:', err);
      setError('Failed to load countries. Please try again.');
    } finally {
      setLoadingCountries(false);
    }
  };

  const fetchStates = async (countryId) => {
    try {
      setLoadingStates(true);
      setStates([]);
      setCities([]);
      setSelectedState(null);
      setSelectedCity(null);
      setFormData((prev) => ({ ...prev, stateId: 0, cityId: 0 }));
      const data = await getStatesByCountry(countryId);
      const statesList = Array.isArray(data) ? data : data?.data || data?.states || [];
      setStates(statesList);
    } catch (err) {
      console.error('Failed to fetch states:', err);
      setError('Failed to load states. Please try again.');
    } finally {
      setLoadingStates(false);
    }
  };

  const fetchCities = async (stateId) => {
    try {
      setLoadingCities(true);
      setCities([]);
      setSelectedCity(null);
      setFormData((prev) => ({ ...prev, cityId: 0 }));
      const data = await getCitiesByState(stateId);
      const citiesList = Array.isArray(data) ? data : data?.data || data?.cities || [];
      setCities(citiesList);
    } catch (err) {
      console.error('Failed to fetch cities:', err);
      setError('Failed to load cities. Please try again.');
    } finally {
      setLoadingCities(false);
    }
  };

  // Helper functions for address objects
  const getId = (item) => {
    if (!item) return null;
    return item.id || item.countryId || item.stateId || item.cityId || item[Object.keys(item)[0]];
  };

  const getName = (item) => {
    if (!item) return '';
    return item.name || item.countryName || item.stateName || item.cityName || item[Object.keys(item)[1]] || '';
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
    }));
    setErrors((prev) => ({
      ...prev,
      organizationId: '',
      companyId: '',
    }));
  };

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      companyId,
    }));
    if (errors.companyId) {
      setErrors((prev) => ({
        ...prev,
        companyId: '',
      }));
    }
  };

  const handleCountryChange = (event, newValue) => {
    setSelectedCountry(newValue);
    const countryId = newValue ? getId(newValue) : 0;
    setFormData((prev) => ({ ...prev, countryId, stateId: 0, cityId: 0 }));
  };

  const handleStateChange = (event, newValue) => {
    setSelectedState(newValue);
    const stateId = newValue ? getId(newValue) : 0;
    setFormData((prev) => ({ ...prev, stateId, cityId: 0 }));
  };

  const handleCityChange = (event, newValue) => {
    setSelectedCity(newValue);
    const cityId = newValue ? getId(newValue) : 0;
    setFormData((prev) => ({ ...prev, cityId }));
  };


  const validateForm = () => {
    const newErrors = {};

    if (!formData.organizationId) {
      newErrors.organizationId = 'Organization is required';
    }

    if (!formData.companyId) {
      newErrors.companyId = 'Company is required';
    }

    if (!formData.branchName.trim()) {
      newErrors.branchName = 'Branch name is required';
    }

    if (!formData.type.trim()) {
      newErrors.type = 'Type is required';
    }

    if (!formData.countryId || formData.countryId === 0) {
      newErrors.countryId = 'Country is required';
    }

    if (!formData.stateId || formData.stateId === 0) {
      newErrors.stateId = 'State is required';
    }

    if (!formData.cityId || formData.cityId === 0) {
      newErrors.cityId = 'City is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
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
        branchId: 0,
        branchName: formData.branchName.trim(),
        branchDescription: formData.branchDescription.trim() || '',
        type: formData.type.trim(),
        countryId: formData.countryId,
        stateId: formData.stateId,
        cityId: formData.cityId,
        companyId: Number(formData.companyId),
        address: formData.address.trim(),
      };

      const response = await createBranch(payload);
      setSuccess('Branch created successfully!');
      handleReset();
    } catch (err) {
      console.error('Error creating branch:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to create branch. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      organizationId: '',
      companyId: '',
      branchName: '',
      type: '',
      countryId: 0,
      stateId: 0,
      cityId: 0,
      address: '',
      branchDescription: '',
    });
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setStates([]);
    setCities([]);
    setCompanies([]);
    setErrors({});
    setError('');
    setSuccess('');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccountTreeIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Create Branch
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Create a new branch by filling in the details below
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Branch Information
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
                >
                  {!formData.organizationId ? (
                    <MenuItem disabled>Please select an organization first</MenuItem>
                  ) : loadingCompanies ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading companies...
                    </MenuItem>
                  ) : companies.length === 0 ? (
                    <MenuItem disabled>No companies available for this organization</MenuItem>
                  ) : (
                    companies.map((company) => (
                      <MenuItem key={company.companyId} value={company.companyId}>
                        {company.companyName || `Company ${company.companyId}`}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.companyId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.companyId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Branch Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Branch Name"
                name="branchName"
                value={formData.branchName}
                onChange={handleChange}
                error={!!errors.branchName}
                helperText={errors.branchName}
                required
                disabled={loading}
              />
            </Grid>

            {/* Type */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                error={!!errors.type}
                helperText={errors.type}
                required
                disabled={loading}
              />
            </Grid>

            {/* Address Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                Address Information
              </Typography>
            </Grid>

            {/* Country */}
            <Grid item xs={12} md={4}>
              <Autocomplete
                options={countries}
                loading={loadingCountries}
                value={selectedCountry}
                onChange={handleCountryChange}
                getOptionLabel={(option) => getName(option)}
                isOptionEqualToValue={(option, value) => getId(option) === getId(value)}
                disabled={loading || loadingCountries}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    required
                    error={!!errors.countryId}
                    helperText={errors.countryId}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingCountries ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* State */}
            <Grid item xs={12} md={4}>
              <Autocomplete
                options={states}
                loading={loadingStates}
                value={selectedState}
                onChange={handleStateChange}
                getOptionLabel={(option) => getName(option)}
                isOptionEqualToValue={(option, value) => getId(option) === getId(value)}
                disabled={loading || loadingStates || !formData.countryId}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="State"
                    required
                    error={!!errors.stateId}
                    helperText={errors.stateId || (!formData.countryId ? 'Select country first' : '')}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingStates ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* City */}
            <Grid item xs={12} md={4}>
              <Autocomplete
                options={cities}
                loading={loadingCities}
                value={selectedCity}
                onChange={handleCityChange}
                getOptionLabel={(option) => getName(option)}
                isOptionEqualToValue={(option, value) => getId(option) === getId(value)}
                disabled={loading || loadingCities || !formData.stateId}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City"
                    required
                    error={!!errors.cityId}
                    helperText={errors.cityId || (!formData.stateId ? 'Select state first' : '')}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingCities ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
                required
                disabled={loading}
                multiline
                rows={2}
              />
            </Grid>

            {/* Branch Description */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Branch Description"
                name="branchDescription"
                value={formData.branchDescription}
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
                  {loading ? 'Creating...' : 'Create Branch'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateBranch;
