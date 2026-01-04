import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PeopleIcon from '@mui/icons-material/People';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllCustomers } from '../../services/customerService';

const ListCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers based on search text
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredCustomers(customers);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = customers.filter((customer) => {
        return (
          (customer.name && customer.name.toLowerCase().includes(searchLower)) ||
          (customer.contact && customer.contact.toLowerCase().includes(searchLower)) ||
          (customer.address && customer.address.toLowerCase().includes(searchLower))
        );
      });
      setFilteredCustomers(filtered);
    }
  }, [searchText, customers]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCustomers();
      setCustomers(data || []);
      setFilteredCustomers(data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch customers');
      setCustomers([]);
      setFilteredCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customerId) => {
    console.log('Edit customer:', customerId);
    // TODO: Navigate to edit page or open edit dialog
    // navigate(`/customers/edit/${customerId}`);
  };

  const handleDelete = (customerId) => {
    console.log('Delete customer:', customerId);
    // TODO: Show confirmation dialog and call delete API
    // if (window.confirm('Are you sure you want to delete this customer?')) {
    //   deleteCustomer(customerId);
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
      field: 'contact',
      headerName: 'Contact',
      flex: 1,
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'address',
      headerName: 'Address',
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
            No address
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
      renderCell: (params) => {
        return params.value ? (
          <Typography variant="body2">{params.value}</Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            -
          </Typography>
        );
      },
    },
    {
      field: 'companyId',
      headerName: 'Company ID',
      width: 150,
      sortable: true,
      type: 'number',
      renderCell: (params) => {
        return params.value ? (
          <Typography variant="body2">{params.value}</Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            -
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
                onClick={() => handleEdit(params.row.id)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(params.row.id)}
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
          <PeopleIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <ListIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            List Customers
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          View and manage all customers
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by name, contact, or address..."
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
              Showing {filteredCustomers.length} of {customers.length} customers
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
        ) : filteredCustomers.length === 0 ? (
          /* No Customers Found */
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
              No customers found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchText
                ? 'Try adjusting your search criteria'
                : 'No customers have been created yet'}
            </Typography>
          </Box>
        ) : (
          /* DataGrid */
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredCustomers}
              columns={columns}
              getRowId={(row) => row.id}
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

export default ListCustomer;


