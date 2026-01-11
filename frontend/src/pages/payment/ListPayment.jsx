import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Box, CircularProgress, Alert, TextField, InputAdornment, IconButton, Tooltip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PaymentIcon from '@mui/icons-material/Payment';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllPayments, getPaymentsByCustomer, deletePayment } from '../../services/paymentService';
import { getCustomersForDropdown } from '../../services/customerService';

const ListPayment = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [customerId, setCustomerId] = useState(''); // Empty string = All Customers
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
    fetchPayments(); // Fetch all payments by default
  }, []);

  // Fetch payments when customer changes
  useEffect(() => {
    fetchPayments();
  }, [customerId]);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredPayments(payments);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = payments.filter((payment) => JSON.stringify(payment).toLowerCase().includes(searchLower));
      setFilteredPayments(filtered);
    }
  }, [searchText, payments]);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const data = await getCustomersForDropdown();
      setCustomers(data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers. Please refresh the page.');
    } finally {
      setLoadingCustomers(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (customerId) {
        data = await getPaymentsByCustomer(customerId);
      } else {
        data = await getAllPayments();
      }
      setPayments(data || []);
      setFilteredPayments(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch payments');
      setPayments([]);
      setFilteredPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await deletePayment(id);
        fetchPayments();
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to delete payment');
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { 
      field: 'customerName', 
      headerName: 'Customer/Supplier Name', 
      flex: 1, 
      minWidth: 200,
      valueGetter: (value, row) => row.customerName || ''
    },
    { 
      field: 'transactionType', 
      headerName: 'Transaction Type', 
      flex: 1, 
      minWidth: 150,
      valueGetter: (value, row) => row.transactionType || ''
    },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      flex: 1, 
      minWidth: 120,
      valueGetter: (value, row) => row.amount || 0,
      renderCell: (params) => {
        const amount = params.row.amount || 0;
        return `₹${parseFloat(amount).toFixed(2)}`;
      }
    },
    { 
      field: 'transactionDate', 
      headerName: 'Transaction Date', 
      flex: 1, 
      minWidth: 150,
      valueGetter: (value, row) => row.transactionDate || '',
      renderCell: (params) => {
        const date = params.row.transactionDate;
        if (!date) return '';
        return new Date(date).toLocaleDateString();
      }
    },
    { 
      field: 'paymentMode', 
      headerName: 'Payment Mode', 
      flex: 1, 
      minWidth: 150,
      valueGetter: (value, row) => row.paymentMode || ''
    },
    { 
      field: 'remarks', 
      headerName: 'Remarks', 
      flex: 1, 
      minWidth: 200,
      valueGetter: (value, row) => row.remarks || ''
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton 
              size="small" 
              onClick={() => navigate(`/payments/create/${params.row.id}`)} 
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              size="small" 
              onClick={() => handleDelete(params.row.id)} 
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PaymentIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <ListIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">List Payments</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">View payments by customer</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }} disabled={loading || loadingCustomers}>
            <InputLabel id="customer-select-label">Customer</InputLabel>
            <Select
              labelId="customer-select-label"
              id="customer-select"
              value={customerId}
              label="Customer"
              onChange={(e) => setCustomerId(e.target.value)}
            >
              <MenuItem value="">
                <em>All Customers</em>
              </MenuItem>
              {loadingCustomers ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading customers...
                </MenuItem>
              ) : customers.length === 0 ? (
                <MenuItem disabled>No customers available</MenuItem>
              ) : (
                customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <TextField fullWidth label="Search Payments" placeholder="Search..." value={searchText} onChange={(e) => setSearchText(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredPayments.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">No payments found</Typography>
          </Box>
        ) : (
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredPayments}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'primary.main',
                  color: '#ffffff',
                  fontWeight: 'bold',
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  color: '#ffffff',
                  fontWeight: 'bold',
                },
                '& .MuiDataGrid-columnHeader': {
                  color: '#ffffff',
                },
                '& .MuiDataGrid-sortIcon': {
                  color: '#ffffff',
                },
                '& .MuiDataGrid-menuIcon': {
                  color: '#ffffff',
                },
                '& .MuiDataGrid-filterIcon': {
                  color: '#ffffff',
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

export default ListPayment;


