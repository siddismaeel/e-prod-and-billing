import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DomainIcon from '@mui/icons-material/Domain';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCompaniesByOrganizationId } from '../../services/companyService';
import { getAllOrganizations } from '../../services/organizationService';

const ListCompany = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState('');
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);
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
    } else {
      setCompanies([]);
      setFilteredCompanies([]);
    }
  }, [selectedOrganizationId]);

  // Filter companies based on search text
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredCompanies(companies);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = companies.filter((company) => {
        return (
          (company.companyName && company.companyName.toLowerCase().includes(searchLower)) ||
          (company.logo && company.logo.toLowerCase().includes(searchLower))
        );
      });
      setFilteredCompanies(filtered);
    }
  }, [searchText, companies]);

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
      setFilteredCompanies(data || []);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch companies');
      setCompanies([]);
      setFilteredCompanies([]);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleOrganizationChange = (e) => {
    setSelectedOrganizationId(e.target.value);
    setSearchText(''); // Clear search when organization changes
  };

  const handleEdit = (companyId) => {
    console.log('Edit company:', companyId);
    // TODO: Navigate to edit page or open edit dialog
    // navigate(`/companies/edit/${companyId}`);
  };

  const handleDelete = (companyId) => {
    console.log('Delete company:', companyId);
    // TODO: Show confirmation dialog and call delete API
    // if (window.confirm('Are you sure you want to delete this company?')) {
    //   deleteCompany(companyId);
    // }
  };

  // Define columns
  const columns = [
    {
      field: 'companyName',
      headerName: 'Company Name',
      flex: 1,
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'logo',
      headerName: 'Logo URL',
      flex: 1,
      minWidth: 250,
      sortable: true,
      renderCell: (params) => {
        return params.value ? (
          <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {params.value}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No logo
          </Typography>
        );
      },
    },
    {
      field: 'organizationId',
      headerName: 'Organization ID',
      width: 150,
      sortable: true,
      type: 'number',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleEdit(params.row.companyId)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(params.row.companyId)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <DomainIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <ListIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            List Companies
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          View and manage all companies by organization
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {/* Organization Selection */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ maxWidth: 400 }} disabled={loadingOrganizations}>
            <InputLabel id="organization-select-label">Select Organization</InputLabel>
            <Select
              labelId="organization-select-label"
              id="organization-select"
              value={selectedOrganizationId}
              label="Select Organization"
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
        </Box>

        {/* Search Bar - Only show when organization is selected */}
        {selectedOrganizationId && (
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by company name or logo URL..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 500 }}
            />
            {searchText && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Showing {filteredCompanies.length} of {companies.length} companies
              </Typography>
            )}
          </Box>
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading State for Companies */}
        {loadingCompanies ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress />
          </Box>
        ) : !selectedOrganizationId ? (
          /* No Organization Selected */
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 400,
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Please select an organization to view companies
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose an organization from the dropdown above
            </Typography>
          </Box>
        ) : filteredCompanies.length === 0 ? (
          /* No Companies Found */
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 400,
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No companies found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchText
                ? 'Try adjusting your search criteria'
                : 'This organization does not have any companies yet'}
            </Typography>
          </Box>
        ) : (
          /* DataGrid */
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredCompanies}
              columns={columns}
              getRowId={(row) => row.companyId}
              pageSizeOptions={[10, 25, 50, 100]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
                sorting: {
                  sortModel: [{ field: 'companyName', sort: 'asc' }],
                },
              }}
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  fontWeight: 'bold',
                },
                '& .MuiDataGrid-columnHeader:focus': {
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

export default ListCompany;
