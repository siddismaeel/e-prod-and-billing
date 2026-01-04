import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Alert, TextField, InputAdornment, IconButton, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PaymentIcon from '@mui/icons-material/Payment';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getPaymentsByCustomer, deletePayment } from '../../services/paymentService';

const ListPayment = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [customerId, setCustomerId] = useState('');

  useEffect(() => {
    if (customerId) {
      fetchPayments();
    } else {
      setPayments([]);
      setFilteredPayments([]);
    }
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

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPaymentsByCustomer(customerId);
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
    { field: 'customerId', headerName: 'Customer ID', flex: 1, minWidth: 150 },
    { field: 'amount', headerName: 'Amount', flex: 1, minWidth: 120 },
    { field: 'paymentDate', headerName: 'Payment Date', flex: 1, minWidth: 150 },
    { field: 'paymentMethod', headerName: 'Payment Method', flex: 1, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Delete">
          <IconButton size="small" onClick={() => handleDelete(params.row.id)} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
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
          <TextField fullWidth label="Customer ID" value={customerId} onChange={(e) => setCustomerId(e.target.value)} type="number" placeholder="Enter Customer ID to fetch payments" sx={{ mb: 2 }} />
          <TextField fullWidth label="Search Payments" placeholder="Search..." value={searchText} onChange={(e) => setSearchText(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
        </Box>
        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box> : !customerId ? <Box sx={{ p: 4, textAlign: 'center' }}><Typography variant="body1" color="text.secondary">Please enter a Customer ID to view payments</Typography></Box> : filteredPayments.length === 0 ? <Box sx={{ p: 4, textAlign: 'center' }}><Typography variant="body1" color="text.secondary">No payments found</Typography></Box> : <Box sx={{ height: 600, width: '100%' }}><DataGrid rows={filteredPayments} columns={columns} getRowId={(row) => row.id} pageSize={10} rowsPerPageOptions={[10, 25, 50]} disableSelectionOnClick sx={{ '& .MuiDataGrid-cell:focus': { outline: 'none' } }} /></Box>}
      </Paper>
    </Container>
  );
};

export default ListPayment;


