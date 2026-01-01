import { useState, useEffect } from 'react';
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
  Chip,
  OutlinedInput,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { createUser } from '../../services/userService';
import { getAllOrganizations } from '../../services/organizationService';
import { getCompaniesByOrganizationId } from '../../services/companyService';
import { getBranchesByCompanyId } from '../../services/branchService';
import { getDepartmentsByOrganizationId } from '../../services/departmentService';
import { getAllRoles } from '../../services/roleService';
import {
  getAllCountries,
  getStatesByCountry,
  getCitiesByState,
} from '../../services/addressService';

const CreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dropdown data state
  const [organizations, setOrganizations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Loading states
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
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
    componyId: '',
    branchId: '',
    departmentId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    countryId: 0,
    stateId: 0,
    cityId: 0,
    roleIds: [],
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Fetch organizations and roles on component mount
  useEffect(() => {
    fetchOrganizations();
    fetchRoles();
    fetchCountries();
  }, []);

  // Fetch companies and departments when organization is selected
  useEffect(() => {
    if (formData.organizationId) {
      fetchCompanies(formData.organizationId);
      fetchDepartments(formData.organizationId);
      setFormData((prev) => ({ ...prev, componyId: '', branchId: '', departmentId: '' }));
      setCompanies([]);
      setBranches([]);
    } else {
      setCompanies([]);
      setBranches([]);
      setDepartments([]);
      setFormData((prev) => ({ ...prev, componyId: '', branchId: '', departmentId: '' }));
    }
  }, [formData.organizationId]);

  // Fetch branches when company is selected
  useEffect(() => {
    if (formData.componyId) {
      fetchBranches(formData.componyId);
      setFormData((prev) => ({ ...prev, branchId: '' }));
      setBranches([]);
    } else {
      setBranches([]);
      setFormData((prev) => ({ ...prev, branchId: '' }));
    }
  }, [formData.componyId]);

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

  const fetchDepartments = async (organizationId) => {
    try {
      setLoadingDepartments(true);
      const data = await getDepartmentsByOrganizationId(organizationId);
      setDepartments(data || []);
    } catch (err) {
      console.error('Error fetching departments:', err);
      // Don't show error for departments as it's optional
    } finally {
      setLoadingDepartments(false);
    }
  };

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const data = await getAllRoles();
      setRoles(data || []);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError('Failed to load roles. Please refresh the page.');
    } finally {
      setLoadingRoles(false);
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
      componyId: '',
      branchId: '',
      departmentId: '',
    }));
    setErrors((prev) => ({
      ...prev,
      organizationId: '',
      componyId: '',
      branchId: '',
      departmentId: '',
    }));
  };

  const handleCompanyChange = (e) => {
    const componyId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      componyId,
      branchId: '',
    }));
    setErrors((prev) => ({
      ...prev,
      componyId: '',
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

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      departmentId,
    }));
    if (errors.departmentId) {
      setErrors((prev) => ({
        ...prev,
        departmentId: '',
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

  const handleRoleChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData((prev) => ({
      ...prev,
      roleIds: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.organizationId) {
      newErrors.organizationId = 'Organization is required';
    }

    if (!formData.componyId) {
      newErrors.componyId = 'Company is required';
    }

    if (!formData.branchId) {
      newErrors.branchId = 'Branch is required';
    }

    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
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

    if (!formData.roleIds || formData.roleIds.length === 0) {
      newErrors.roleIds = 'At least one role is required';
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
        userId: 0,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        stateId: formData.stateId,
        cityId: formData.cityId,
        countryId: formData.countryId,
        email: formData.email.trim(),
        branchId: Number(formData.branchId),
        departmentId: Number(formData.departmentId),
        organizationId: Number(formData.organizationId),
        componyId: Number(formData.componyId),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        roleIds: formData.roleIds.map((id) => Number(id)),
      };

      const response = await createUser(payload);
      setSuccess('User created successfully!');
      handleReset();
    } catch (err) {
      console.error('Error creating user:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to create user. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      organizationId: '',
      componyId: '',
      branchId: '',
      departmentId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      countryId: 0,
      stateId: 0,
      cityId: 0,
      roleIds: [],
    });
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setStates([]);
    setCities([]);
    setCompanies([]);
    setBranches([]);
    setDepartments([]);
    setErrors({});
    setError('');
    setSuccess('');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonAddIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Create User
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Create a new user by filling in the details below
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          User Information
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
          <Grid spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
                Organization & Company Information
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            {/* Section 1: Organization & Company Information */}

            {/* Organization Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.organizationId} disabled={loading || loadingOrganizations}>
                <InputLabel id="organization-select-label">Organization</InputLabel>
                <Select
                  labelId="organization-select-label"
                  id="organization-select"
                  name="organizationId"
                  value={formData.organizationId || ''}
                  label="Organization"
                  onChange={handleOrganizationChange}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        width: 'auto',
                        minWidth: '200px',
                      },
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select an organization</em>
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
                {errors.organizationId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.organizationId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Company Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.componyId} disabled={loading || loadingCompanies || !formData.organizationId}>
                <InputLabel id="company-select-label">Company</InputLabel>
                <Select
                  labelId="company-select-label"
                  id="company-select"
                  name="componyId"
                  value={formData.componyId || ''}
                  label="Company"
                  onChange={handleCompanyChange}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        width: 'auto',
                        minWidth: '200px',
                      },
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select a company</em>
                  </MenuItem>
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
                {errors.componyId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.componyId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Branch Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.branchId} disabled={loading || loadingBranches || !formData.componyId}>
                <InputLabel id="branch-select-label">Branch</InputLabel>
                <Select
                  labelId="branch-select-label"
                  id="branch-select"
                  name="branchId"
                  value={formData.branchId || ''}
                  label="Branch"
                  onChange={handleBranchChange}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        width: 'auto',
                        minWidth: '200px',
                      },
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select a branch</em>
                  </MenuItem>
                  {!formData.componyId ? (
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

            {/* Department Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.departmentId} disabled={loading || loadingDepartments || !formData.organizationId}>
                <InputLabel id="department-select-label">Department</InputLabel>
                <Select
                  labelId="department-select-label"
                  id="department-select"
                  name="departmentId"
                  value={formData.departmentId || ''}
                  label="Department"
                  onChange={handleDepartmentChange}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        width: 'auto',
                        minWidth: '200px',
                      },
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select a department</em>
                  </MenuItem>
                  {!formData.organizationId ? (
                    <MenuItem value="" disabled>
                      Please select an organization first
                    </MenuItem>
                  ) : loadingDepartments ? (
                    <MenuItem value="" disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading departments...
                    </MenuItem>
                  ) : departments.length === 0 ? (
                    <MenuItem value="" disabled>
                      No departments available for this organization
                    </MenuItem>
                  ) : (
                    departments.map((dept) => {
                      const deptId = dept.departmentId || dept.id;
                      const deptIdStr = String(deptId);
                      return (
                        <MenuItem key={deptId} value={deptIdStr}>
                          {dept.departmentName || dept.name || `Department ${deptId}`}
                        </MenuItem>
                      );
                    })
                  )}
                </Select>
                {errors.departmentId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.departmentId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
              Personal Information
            </Typography>
          </Grid>
          <Grid container spacing={3}>
            {/* Section 2: Personal Information */}


            {/* First Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
                disabled={loading}
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
                disabled={loading}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
                disabled={loading}
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                required
                disabled={loading}
              />
            </Grid>
          </Grid>
          {/* Section 3: Address Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
              Address Information
            </Typography>
          </Grid>
          <Grid container spacing={3}>
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
                    fullWidth
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
                    fullWidth
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
                    fullWidth
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
            <Grid item xs={12}>
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
                rows={3}
              />
            </Grid>
          </Grid>
          {/* Section 4: Role Selection */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 1, mb: 2, fontWeight: 'bold' }}>
              Role Selection
            </Typography>
          </Grid>
          <Grid container spacing={3}>
            {/* Role IDs */}
            <Grid item xs={12}>
              <FormControl fullWidth required error={!!errors.roleIds} disabled={loading || loadingRoles}>
                <InputLabel id="role-select-label">Roles</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  multiple
                  value={formData.roleIds}
                  onChange={handleRoleChange}
                  input={<OutlinedInput label="Roles" />}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        width: 'auto',
                        minWidth: '200px',
                      },
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const role = roles.find((r) => String(r.roleId || r.id) === String(value));
                        return (
                          <Chip
                            key={value}
                            label={role ? (role.name || role.roleName || `Role ${value}`) : value}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {loadingRoles ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading roles...
                    </MenuItem>
                  ) : roles.length === 0 ? (
                    <MenuItem disabled>No roles available</MenuItem>
                  ) : (
                    roles.map((role) => {
                      const roleId = role.roleId || role.id;
                      const roleIdStr = String(roleId);
                      const roleName = role.name || role.roleName || `Role ${roleId}`;
                      return (
                        <MenuItem key={roleId} value={roleIdStr}>
                          {roleName}
                        </MenuItem>
                      );
                    })
                  )}
                </Select>
                {errors.roleIds && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.roleIds}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
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
                  {loading ? 'Creating...' : 'Create User'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateUser;
