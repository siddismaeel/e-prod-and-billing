import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllOrganizations } from '../../services/organizationService';

const ListOrganization = () => {
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Fetch organizations on component mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Filter organizations based on search text
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredOrganizations(organizations);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = organizations.filter((org) => {
        return (
          (org.name && org.name.toLowerCase().includes(searchLower)) ||
          (org.businessLocation && org.businessLocation.toLowerCase().includes(searchLower)) ||
          (org.planName && org.planName.toLowerCase().includes(searchLower))
        );
      });
      setFilteredOrganizations(filtered);
    }
  }, [searchText, organizations]);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllOrganizations();
      setOrganizations(data || []);
      setFilteredOrganizations(data || []);
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (organizationId) => {
    console.log('Edit organization:', organizationId);
    // TODO: Navigate to edit page or open edit dialog
    // navigate(`/organizations/edit/${organizationId}`);
  };

  const handleDelete = (organizationId) => {
    console.log('Delete organization:', organizationId);
    // TODO: Show confirmation dialog and call delete API
    // if (window.confirm('Are you sure you want to delete this organization?')) {
    //   deleteOrganization(organizationId);
    // }
  };

  // Define columns
  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'businessLocation',
      headerName: 'Business Location',
      flex: 1,
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'planName',
      headerName: 'Plan Name',
      flex: 1,
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'totalCompanies',
      headerName: 'Total Companies',
      width: 150,
      sortable: true,
      type: 'number',
    },
    {
      field: 'active',
      headerName: 'Active',
      width: 120,
      sortable: true,
      renderCell: (params) => {
        return (
          <Chip
            label={params.value ? 'Active' : 'Inactive'}
            color={params.value ? 'success' : 'default'}
            size="small"
          />
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
                onClick={() => handleEdit(params.row.organizationId)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(params.row.organizationId)}
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
          <CorporateFareIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <ListIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            List Organizations
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          View and manage all organizations
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by name, business location, or plan name..."
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
              Showing {filteredOrganizations.length} of {organizations.length} organizations
            </Typography>
          )}
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress />
          </Box>
        ) : (
          /* DataGrid */
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredOrganizations}
              columns={columns}
              getRowId={(row) => row.organizationId}
              pageSizeOptions={[10, 25, 50, 100]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
                sorting: {
                  sortModel: [{ field: 'name', sort: 'asc' }],
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

export default ListOrganization;
