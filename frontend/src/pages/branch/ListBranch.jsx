import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ListIcon from '@mui/icons-material/List';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getBranchesByCompanyId } from '../../services/branchService';
import { getAllOrganizations } from '../../services/organizationService';
import { getCompaniesByOrganizationId } from '../../services/companyService';

const ListBranch = () => {
  const [branches, setBranches] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [error, setError] = useState(null);

  // Fetch organizations on component mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Fetch companies when organization is selected
  useEffect(() => {
    if (selectedOrganizationId) {
      fetchCompanies(selectedOrganizationId);
      setSelectedCompanyId(''); // Reset company selection
      setBranches([]); // Clear branches
    } else {
      setCompanies([]);
      setSelectedCompanyId('');
      setBranches([]);
    }
  }, [selectedOrganizationId]);

  // Fetch branches when company is selected
  useEffect(() => {
    if (selectedCompanyId) {
      fetchBranches(selectedCompanyId);
    } else {
      setBranches([]);
    }
  }, [selectedCompanyId]);

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

  const fetchBranches = async (companyId) => {
    try {
      setLoadingBranches(true);
      setError(null);
      const data = await getBranchesByCompanyId(companyId);
      setBranches(data || []);
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch branches');
      setBranches([]);
    } finally {
      setLoadingBranches(false);
    }
  };

  const handleOrganizationChange = (e) => {
    setSelectedOrganizationId(e.target.value);
  };

  const handleCompanyChange = (e) => {
    const value = e.target.value;
    console.log('Company selected:', value);
    setSelectedCompanyId(value || '');
  };

  const handleEdit = (branchId) => {
    console.log('Edit branch:', branchId);
    // TODO: Navigate to edit page or open edit dialog
    // navigate(`/branches/edit/${branchId}`);
  };

  const handleDelete = (branchId) => {
    console.log('Delete branch:', branchId);
    // TODO: Show confirmation dialog and call delete API
    // if (window.confirm('Are you sure you want to delete this branch?')) {
    //   deleteBranch(branchId);
    // }
  };

  // Define columns
  const columns = [
    {
      field: 'active',
      headerName: 'Active',
      width: 120,
      sortable: true,
      renderCell: (params) => {
        // Check if active field exists, default to true if not present
        const isActive = params.value !== undefined ? params.value : true;
        return (
          <Chip
            label={isActive ? 'Active' : 'Inactive'}
            color={isActive ? 'success' : 'default'}
            size="small"
          />
        );
      },
    },
    {
      field: 'branchName',
      headerName: 'Branch Name',
      flex: 1,
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      minWidth: 250,
      sortable: true,
      renderCell: (params) => {
        const description = params.value || '';
        return (
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={description}
          >
            {description || 'No description'}
          </Typography>
        );
      },
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
      minWidth: 250,
      sortable: true,
      renderCell: (params) => {
        const address = params.value || '';
        return (
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={address}
          >
            {address || 'No address'}
          </Typography>
        );
      },
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
                onClick={() => handleEdit(params.row.branchId)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(params.row.branchId)}
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
          <AccountTreeIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <ListIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            List Branches
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          View and manage all branches by organization and company
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {/* Organization and Company Selection */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 250 }} disabled={loadingOrganizations}>
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

          <FormControl
            sx={{ minWidth: 250 }}
            disabled={loadingCompanies || !selectedOrganizationId}
          >
            <InputLabel id="company-select-label">Select Company</InputLabel>
            <Select
              labelId="company-select-label"
              id="company-select"
              value={selectedCompanyId}
              label="Select Company"
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
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading State for Branches */}
        {loadingBranches ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress />
          </Box>
        ) : !selectedCompanyId ? (
          /* No Company Selected */
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
              Please select an organization and company to view branches
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose an organization and company from the dropdowns above
            </Typography>
          </Box>
        ) : branches.length === 0 ? (
          /* No Branches Found */
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
              No branches found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This company does not have any branches yet
            </Typography>
          </Box>
        ) : (
          /* DataGrid */
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={branches}
              columns={columns}
              getRowId={(row) => row.branchId}
              pageSizeOptions={[10, 25, 50, 100]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
                sorting: {
                  sortModel: [{ field: 'branchName', sort: 'asc' }],
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

export default ListBranch;
