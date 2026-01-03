import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Alert, TextField, InputAdornment } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import { getAllReadyItems } from '../../services/readyItemService';

const ListReadyItem = () => {
  const [readyItems, setReadyItems] = useState([]);
  const [filteredReadyItems, setFilteredReadyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchReadyItems();
  }, []);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredReadyItems(readyItems);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = readyItems.filter((item) => {
        return (
          (item.name && item.name.toLowerCase().includes(searchLower)) ||
          (item.code && item.code.toLowerCase().includes(searchLower)) ||
          (item.unit && item.unit.toLowerCase().includes(searchLower)) ||
          (item.description && item.description.toLowerCase().includes(searchLower))
        );
      });
      setFilteredReadyItems(filtered);
    }
  }, [searchText, readyItems]);

  const fetchReadyItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllReadyItems();
      setReadyItems(data || []);
      setFilteredReadyItems(data || []);
    } catch (err) {
      console.error('Error fetching ready items:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch ready items');
      setReadyItems([]);
      setFilteredReadyItems([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 200, sortable: true },
    { field: 'code', headerName: 'Code', flex: 1, minWidth: 150, sortable: true },
    { field: 'unit', headerName: 'Unit', flex: 1, minWidth: 100, sortable: true },
    { field: 'description', headerName: 'Description', flex: 1, minWidth: 250, sortable: false },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ShoppingCartIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <ListIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">List Ready Items</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">View and manage all ready items</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}

      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <TextField fullWidth label="Search Ready Items" placeholder="Search by name, code, unit, or description..." value={searchText} onChange={(e) => setSearchText(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : filteredReadyItems.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">{searchText ? 'No ready items found matching your search' : 'No ready items found'}</Typography>
          </Box>
        ) : (
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid rows={filteredReadyItems} columns={columns} getRowId={(row) => row.id || row.readyItemId} pageSize={10} rowsPerPageOptions={[10, 25, 50]} disableSelectionOnClick sx={{ '& .MuiDataGrid-cell:focus': { outline: 'none' } }} />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ListReadyItem;

