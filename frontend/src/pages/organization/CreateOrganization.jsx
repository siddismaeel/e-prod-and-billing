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
  Checkbox,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete,
} from '@mui/material';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { createOrganization } from '../../services/organizationService';
import {
  getAllCountries,
  getStatesByCountry,
  getCitiesByState,
} from '../../services/addressService';

const CreateOrganization = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Address data state
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Selected address objects (for Autocomplete)
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    organizationId: 0,
    name: '',
    pinCode: '',
    businessLocation: '',
    adminCount: 0,
    companyCount: 0,
    orgImgUrl: '',
    countryId: 0,
    stateId: 0,
    cityId: 0,
    description: '',
    adminFirstName: '',
    adminMiddleName: '',
    adminLastName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    profileImageUrl: '',
    adminPoc: true,
    planId: 1,
    status: '',
    gstNo: '',
    panNo: '',
    noOfBasicUsers: 0,
    noOfAdvancedUsers: 0,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? 0 : parseInt(value, 10) || 0,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Organization name is required');
      return false;
    }
    if (!formData.businessLocation.trim()) {
      setError('Business location is required');
      return false;
    }
    if (!formData.pinCode.trim()) {
      setError('PIN code is required');
      return false;
    }
    if (!formData.adminFirstName.trim()) {
      setError('Admin first name is required');
      return false;
    }
    if (!formData.adminLastName.trim()) {
      setError('Admin last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (formData.countryId === 0) {
      setError('Please select a country');
      return false;
    }
    if (formData.stateId === 0) {
      setError('Please select a state');
      return false;
    }
    if (formData.cityId === 0) {
      setError('Please select a city');
      return false;
    }
    if (!formData.planId || formData.planId === 0) {
      setError('Please select a plan');
      return false;
    }
    if (!formData.status.trim()) {
      setError('Status is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await createOrganization(formData);
      setSuccess('Organization created successfully!');
      // Optionally redirect after a delay
      setTimeout(() => {
        navigate('/organizations/list');
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to create organization. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const data = await getAllCountries();
        // Handle different response structures
        const countriesList = Array.isArray(data) ? data : data?.data || data?.countries || [];
        setCountries(countriesList);
      } catch (err) {
        console.error('Failed to fetch countries:', err);
        setError('Failed to load countries. Please refresh the page.');
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch states when country is selected
  useEffect(() => {
    const fetchStates = async () => {
      if (formData.countryId && formData.countryId > 0) {
        setLoadingStates(true);
        setStates([]);
        setCities([]);
        setSelectedState(null);
        setSelectedCity(null);
        setFormData((prev) => ({ ...prev, stateId: 0, cityId: 0 }));
        try {
          const data = await getStatesByCountry(formData.countryId);
          const statesList = Array.isArray(data) ? data : data?.data || data?.states || [];
          setStates(statesList);
        } catch (err) {
          console.error('Failed to fetch states:', err);
          setError('Failed to load states. Please try again.');
        } finally {
          setLoadingStates(false);
        }
      } else {
        setStates([]);
        setSelectedState(null);
      }
    };
    fetchStates();
  }, [formData.countryId]);

  // Fetch cities when state is selected
  useEffect(() => {
    const fetchCities = async () => {
      if (formData.stateId && formData.stateId > 0) {
        setLoadingCities(true);
        setCities([]);
        setSelectedCity(null);
        setFormData((prev) => ({ ...prev, cityId: 0 }));
        try {
          const data = await getCitiesByState(formData.stateId);
          const citiesList = Array.isArray(data) ? data : data?.data || data?.cities || [];
          setCities(citiesList);
        } catch (err) {
          console.error('Failed to fetch cities:', err);
          setError('Failed to load cities. Please try again.');
        } finally {
          setLoadingCities(false);
        }
      } else {
        setCities([]);
        setSelectedCity(null);
      }
    };
    fetchCities();
  }, [formData.stateId]);

  // Helper function to get ID from address object (handles different structures)
  const getId = (item) => {
    if (!item) return null;
    return item.id || item.countryId || item.stateId || item.cityId || item[Object.keys(item)[0]];
  };

  // Helper function to get name from address object (handles different structures)
  const getName = (item) => {
    if (!item) return '';
    return item.name || item.countryName || item.stateName || item.cityName || item[Object.keys(item)[1]] || '';
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

  const handleReset = () => {
    setFormData({
      organizationId: 0,
      name: '',
      pinCode: '',
      businessLocation: '',
      adminCount: 0,
      companyCount: 0,
      orgImgUrl: '',
      countryId: 0,
      stateId: 0,
      cityId: 0,
      description: '',
      adminFirstName: '',
      adminMiddleName: '',
      adminLastName: '',
      email: '',
      phone: '',
      alternatePhone: '',
      profileImageUrl: '',
      adminPoc: true,
      planId: 1,
      status: '',
      gstNo: '',
      panNo: '',
      noOfBasicUsers: 0,
      noOfAdvancedUsers: 0,
    });
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setStates([]);
    setCities([]);
    setError('');
    setSuccess('');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CorporateFareIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Create Organization
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Fill in the details to create a new organization
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
          {/* Section 1: Organization Basic Information */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
            Organization Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Organization Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="PIN Code"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Location"
                name="businessLocation"
                value={formData.businessLocation}
                onChange={handleChange}
                required
                disabled={loading}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Organization Image URL"
                name="orgImgUrl"
                value={formData.orgImgUrl}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>

          {/* Section 2: Location Details */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Location Details
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Autocomplete
                options={countries}
                getOptionLabel={(option) => getName(option)}
                value={selectedCountry}
                onChange={handleCountryChange}
                loading={loadingCountries}
                disabled={loading || loadingCountries}
                isOptionEqualToValue={(option, value) => getId(option) === getId(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingCountries ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                options={states}
                getOptionLabel={(option) => getName(option)}
                value={selectedState}
                onChange={handleStateChange}
                loading={loadingStates}
                disabled={loading || loadingStates || !formData.countryId || formData.countryId === 0}
                isOptionEqualToValue={(option, value) => getId(option) === getId(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="State"
                    required
                    placeholder={!formData.countryId || formData.countryId === 0 ? 'Select country first' : 'Select state'}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingStates ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                options={cities}
                getOptionLabel={(option) => getName(option)}
                value={selectedCity}
                onChange={handleCityChange}
                loading={loadingCities}
                disabled={loading || loadingCities || !formData.stateId || formData.stateId === 0}
                isOptionEqualToValue={(option, value) => getId(option) === getId(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City"
                    required
                    placeholder={!formData.stateId || formData.stateId === 0 ? 'Select state first' : 'Select city'}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingCities ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Section 3: Admin Information */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Admin Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="First Name"
                name="adminFirstName"
                value={formData.adminFirstName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Middle Name"
                name="adminMiddleName"
                value={formData.adminMiddleName}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Last Name"
                name="adminLastName"
                value={formData.adminLastName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Alternate Phone"
                name="alternatePhone"
                type="tel"
                value={formData.alternatePhone}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Profile Image URL"
                name="profileImageUrl"
                value={formData.profileImageUrl}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://example.com/profile.jpg"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="adminPoc"
                    checked={formData.adminPoc}
                    onChange={handleChange}
                    disabled={loading}
                  />
                }
                label="Admin Point of Contact"
              />
            </Grid>
          </Grid>

          {/* Section 4: Business Details */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Business Details
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GST Number"
                name="gstNo"
                value={formData.gstNo}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="PAN Number"
                name="panNo"
                value={formData.panNo}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Plan</InputLabel>
                <Select
                  name="planId"
                  value={formData.planId}
                  onChange={handleNumericChange}
                  label="Plan"
                  disabled={loading}
                >
                  <MenuItem value={0}>Select Plan</MenuItem>
                  <MenuItem value={1}>Basic Plan</MenuItem>
                  <MenuItem value={2}>Advanced Plan</MenuItem>
                  <MenuItem value={3}>Premium Plan</MenuItem>
                  {/* Add more plans as needed */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                  disabled={loading}
                >
                  <MenuItem value="">Select Status</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="SUSPENDED">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Section 5: User Configuration */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
            User Configuration
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Number of Basic Users"
                name="noOfBasicUsers"
                type="number"
                value={formData.noOfBasicUsers}
                onChange={handleNumericChange}
                disabled={loading}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Number of Advanced Users"
                name="noOfAdvancedUsers"
                type="number"
                value={formData.noOfAdvancedUsers}
                onChange={handleNumericChange}
                disabled={loading}
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>

          {/* Form Actions */}
          <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
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
              {loading ? 'Creating...' : 'Create Organization'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateOrganization;
