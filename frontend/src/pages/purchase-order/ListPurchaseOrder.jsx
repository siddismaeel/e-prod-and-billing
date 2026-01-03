import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Alert, TextField, InputAdornment, IconButton, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllPurchaseOrders, deletePurchaseOrder } from '../../services/purchaseOrderService';

const ListPurchaseOrder = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [filteredPurchaseOrders, setFilteredPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredPurchaseOrders(purchaseOrders);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = purchaseOrders.filter((order) => JSON.stringify(order).toLowerCase().includes(searchLower));
      setFilteredPurchaseOrders(filtered);
    }
  }, [searchText, purchaseOrders]);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPurchaseOrders();
      setPurchaseOrders(data || []);
      setFilteredPurchaseOrders(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch purchase orders');
      setPurchaseOrders([]);
      setFilteredPurchaseOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      try {
        await deletePurchaseOrder(id);
        fetchPurchaseOrders();
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to delete purchase order');
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'supplierId', headerName: 'Supplier ID', flex: 1, minWidth: 150 },
    { field: 'orderDate', headerName: 'Order Date', flex: 1, minWidth: 150 },
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
          <ShoppingCartIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <ListIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">List Purchase Orders</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">View and manage all purchase orders</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <TextField fullWidth label="Search Purchase Orders" placeholder="Search..." value={searchText} onChange={(e) => setSearchText(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
        </Box>
        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box> : filteredPurchaseOrders.length === 0 ? <Box sx={{ p: 4, textAlign: 'center' }}><Typography variant="body1" color="text.secondary">No purchase orders found</Typography></Box> : <Box sx={{ height: 600, width: '100%' }}><DataGrid rows={filteredPurchaseOrders} columns={columns} getRowId={(row) => row.id} pageSize={10} rowsPerPageOptions={[10, 25, 50]} disableSelectionOnClick sx={{ '& .MuiDataGrid-cell:focus': { outline: 'none' } }} /></Box>}
      </Paper>
    </Container>
  );
};

export default ListPurchaseOrder;

