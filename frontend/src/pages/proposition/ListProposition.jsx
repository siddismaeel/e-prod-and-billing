import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Alert, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import { getPropositionsByReadyItem } from '../../services/propositionService';
import { getAllReadyItems } from '../../services/readyItemService';

const ListProposition = () => {
  const [propositions, setPropositions] = useState([]);
  const [filteredPropositions, setFilteredPropositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [readyItemId, setReadyItemId] = useState('');

  // Ready items dropdown data
  const [readyItems, setReadyItems] = useState([]);
  const [loadingReadyItems, setLoadingReadyItems] = useState(true);

  // Fetch ready items on component mount
  useEffect(() => {
    fetchReadyItems();
  }, []);

  // Fetch ready items
  const fetchReadyItems = async () => {
    try {
      setLoadingReadyItems(true);
      const data = await getAllReadyItems();
      setReadyItems(data || []);
    } catch (err) {
      console.error('Error fetching ready items:', err);
      setError('Failed to load ready items. Please refresh the page.');
    } finally {
      setLoadingReadyItems(false);
    }
  };

  useEffect(() => {
    if (readyItemId) {
      fetchPropositions();
    } else {
      setPropositions([]);
      setFilteredPropositions([]);
    }
  }, [readyItemId]);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredPropositions(propositions);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = propositions.filter((prop) => JSON.stringify(prop).toLowerCase().includes(searchLower));
      setFilteredPropositions(filtered);
    }
  }, [searchText, propositions]);

  const fetchPropositions = async () => {
    try {
      setLoading(true);
      setError(null);
      const orderId = readyItemId ? Number(readyItemId) : null;
      if (!orderId) {
        setPropositions([]);
        setFilteredPropositions([]);
        return;
      }
      const data = await getPropositionsByReadyItem(orderId);
      setPropositions(data || []);
      setFilteredPropositions(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch propositions');
      setPropositions([]);
      setFilteredPropositions([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'readyItemId', headerName: 'Ready Item ID', flex: 1, minWidth: 150 },
    { field: 'rawMaterialId', headerName: 'Raw Material ID', flex: 1, minWidth: 150 },
    { field: 'expectedPercentage', headerName: 'Expected Percentage', flex: 1, minWidth: 150 },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrendingUpIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <ListIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">List Propositions</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">View propositions by ready item</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }} disabled={loadingReadyItems}>
            <InputLabel id="ready-item-select-label">Ready Item</InputLabel>
            <Select
              labelId="ready-item-select-label"
              id="ready-item-select"
              value={readyItemId}
              label="Ready Item"
              onChange={(e) => setReadyItemId(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select Ready Item</em>
              </MenuItem>
              {loadingReadyItems ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading ready items...
                </MenuItem>
              ) : readyItems.length === 0 ? (
                <MenuItem disabled>No ready items available</MenuItem>
              ) : (
                readyItems.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <TextField fullWidth label="Search Propositions" placeholder="Search..." value={searchText} onChange={(e) => setSearchText(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
        </Box>
        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box> : !readyItemId ? <Box sx={{ p: 4, textAlign: 'center' }}><Typography variant="body1" color="text.secondary">Please select a Ready Item to view propositions</Typography></Box> : filteredPropositions.length === 0 ? <Box sx={{ p: 4, textAlign: 'center' }}><Typography variant="body1" color="text.secondary">No propositions found</Typography></Box> : <Box sx={{ height: 600, width: '100%' }}><DataGrid rows={filteredPropositions} columns={columns} getRowId={(row) => row.id} pageSize={10} rowsPerPageOptions={[10, 25, 50]} disableSelectionOnClick sx={{ '& .MuiDataGrid-cell:focus': { outline: 'none' } }} /></Box>}
      </Paper>
    </Container>
  );
};

export default ListProposition;

