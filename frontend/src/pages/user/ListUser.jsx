import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Grid,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import { getUsersByCompanyId } from '../../services/userService';
import { getAllOrganizations } from '../../services/organizationService';
import { getCompaniesByOrganizationId } from '../../services/companyService';

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Fetch organizations on component mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Fetch companies when organization is selected
  useEffect(() => {
    if (selectedOrganizationId) {
      fetchCompanies(selectedOrganizationId);
      setSelectedCompanyId(''); // Reset company selection
      setUsers([]); // Clear users
      setFilteredUsers([]);
    } else {
      setCompanies([]);
      setSelectedCompanyId('');
      setUsers([]);
      setFilteredUsers([]);
    }
  }, [selectedOrganizationId]);

  // Fetch users when company is selected
  useEffect(() => {
    if (selectedCompanyId) {
      fetchUsers(selectedCompanyId);
    } else {
      setUsers([]);
      setFilteredUsers([]);
    }
  }, [selectedCompanyId]);

  // Filter users based on search text
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredUsers(users);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = users.filter((user) => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        const email = (user.email || '').toLowerCase();
        const phone = (user.phone || '').toLowerCase();
        return (
          fullName.includes(searchLower) ||
          email.includes(searchLower) ||
          phone.includes(searchLower)
        );
      });
      setFilteredUsers(filtered);
    }
  }, [searchText, users]);

  const fetchOrganizations = async () => {
    try {
      setLoadingOrganizations(true);
      setError(null);
      const data = await getAllOrganizations();
      setOrganizations(data || []);
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch organizations');
    } finally {
      setLoadingOrganizations(false);
    }
  };

  const fetchCompanies = async (organizationId) => {
    try {
      setLoadingCompanies(true);
      setError(null);
      const data = await getCompaniesByOrganizationId(organizationId);
      setCompanies(data || []);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch companies');
      setCompanies([]);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const fetchUsers = async (companyId) => {
    try {
      setLoadingUsers(true);
      setError(null);
      const data = await getUsersByCompanyId(companyId);
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch users');
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleOrganizationChange = (e) => {
    setSelectedOrganizationId(e.target.value);
  };

  const handleCompanyChange = (e) => {
    const value = e.target.value;
    setSelectedCompanyId(value || '');
  };

  // Define columns
  const columns = [
    {
      field: 'fullName',
      headerName: 'Full Name',
      flex: 1,
      minWidth: 200,
      sortable: true,
      valueGetter: (params) => {
        const firstName = params.row.firstName || '';
        const lastName = params.row.lastName || '';
        return `${firstName} ${lastName}`.trim() || 'N/A';
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'roles',
      headerName: 'Roles',
      flex: 1,
      minWidth: 200,
      sortable: false,
      valueGetter: (params) => {
        const roles = params.row.roles || [];
        return roles.map(role => role.name || role.roleName || '').filter(Boolean).join(', ') || 'No roles';
      },
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonAddIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <ListIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            List Users
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          View and manage all users by organization and company
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        {/* Filter Section */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={3}>
            {/* Organization Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={loadingOrganizations}>
                <InputLabel id="organization-select-label">Organization</InputLabel>
                <Select
                  labelId="organization-select-label"
                  id="organization-select"
                  value={selectedOrganizationId || ''}
                  label="Organization"
                  onChange={handleOrganizationChange}
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
              </FormControl>
            </Grid>

            {/* Company Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={loadingCompanies || !selectedOrganizationId}>
                <InputLabel id="company-select-label">Company</InputLabel>
                <Select
                  labelId="company-select-label"
                  id="company-select"
                  value={selectedCompanyId || ''}
                  label="Company"
                  onChange={handleCompanyChange}
                >
                  <MenuItem value="">
                    <em>Select a company</em>
                  </MenuItem>
                  {!selectedOrganizationId ? (
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
              </FormControl>
            </Grid>

            {/* Search */}
            {selectedCompanyId && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Search Users"
                  placeholder="Search by name, email, or phone..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Box>

        {/* DataGrid */}
        {loadingUsers ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : !selectedCompanyId ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Please select an organization and company to view users
            </Typography>
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              {searchText ? 'No users found matching your search' : 'No users found for this company'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              getRowId={(row) => row.userId || row.id}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ListUser;
