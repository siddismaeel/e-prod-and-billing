import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Box, CircularProgress, Alert, TextField, InputAdornment, IconButton, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAllSalesOrders, deleteSalesOrder } from '../../services/salesOrderService';

const ListSalesOrder = () => {
  const navigate = useNavigate();
  const [salesOrders, setSalesOrders] = useState([]);
  const [filteredSalesOrders, setFilteredSalesOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchSalesOrders();
  }, []);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredSalesOrders(salesOrders);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = salesOrders.filter((order) => JSON.stringify(order).toLowerCase().includes(searchLower));
      setFilteredSalesOrders(filtered);
    }
  }, [searchText, salesOrders]);

  const fetchSalesOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllSalesOrders();
      setSalesOrders(data || []);
      setFilteredSalesOrders(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch sales orders');
      setSalesOrders([]);
      setFilteredSalesOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sales order?')) {
      try {
        await deleteSalesOrder(id);
        fetchSalesOrders();
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to delete sales order');
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { 
      field: 'customerName', 
      headerName: 'Customer Name', 
      flex: 1, 
      minWidth: 200,
      valueGetter: (value, row) => row.customerName || '-',
    },
    { field: 'orderDate', headerName: 'Order Date', flex: 1, minWidth: 150 },
    { 
      field: 'totalAmount', 
      headerName: 'Total Amount', 
      flex: 1, 
      minWidth: 150,
      type: 'number',
      valueGetter: (value, row) => row.totalAmount || 0,
      renderCell: (params) => params.value ? `₹${Number(params.value).toFixed(2)}` : '₹0.00',
    },
    { 
      field: 'paidAmount', 
      headerName: 'Paid Amount', 
      flex: 1, 
      minWidth: 150,
      type: 'number',
      valueGetter: (value, row) => row.paidAmount || 0,
      renderCell: (params) => params.value ? `₹${Number(params.value).toFixed(2)}` : '₹0.00',
    },
    { 
      field: 'balancePayment', 
      headerName: 'Balance', 
      flex: 1, 
      minWidth: 150,
      type: 'number',
      valueGetter: (value, row) => row.balancePayment || 0,
      renderCell: (params) => params.value ? `₹${Number(params.value).toFixed(2)}` : '₹0.00',
    },
    { 
      field: 'paymentStatus', 
      headerName: 'Payment Status', 
      flex: 1, 
      minWidth: 150,
      valueGetter: (value, row) => row.paymentStatus || '-',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View">
            <IconButton 
              size="small" 
              onClick={() => navigate(`/sales-orders/view/${params.row.id}`)} 
              color="primary"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => handleDelete(params.row.id)} color="error">
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
          <ReceiptIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <ListIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">List Sales Orders</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">View and manage all sales orders</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <TextField fullWidth label="Search Sales Orders" placeholder="Search..." value={searchText} onChange={(e) => setSearchText(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredSalesOrders.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              {searchText ? 'No sales orders found' : 'No sales orders found'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredSalesOrders}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableRowSelectionOnClick
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

export default ListSalesOrder;


