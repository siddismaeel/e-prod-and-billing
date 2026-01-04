import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Alert, TextField, InputAdornment } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ScienceIcon from '@mui/icons-material/Science';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import { getConsumptions } from '../../services/materialConsumptionService';

const ListMaterialConsumption = () => {
  const [consumptions, setConsumptions] = useState([]);
  const [filteredConsumptions, setFilteredConsumptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchConsumptions();
  }, []);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredConsumptions(consumptions);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = consumptions.filter((cons) => JSON.stringify(cons).toLowerCase().includes(searchLower));
      setFilteredConsumptions(filtered);
    }
  }, [searchText, consumptions]);

  const fetchConsumptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getConsumptions();
      setConsumptions(data || []);
      setFilteredConsumptions(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch material consumptions');
      setConsumptions([]);
      setFilteredConsumptions([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'rawMaterialId', headerName: 'Raw Material ID', flex: 1, minWidth: 150 },
    { field: 'quantity', headerName: 'Quantity', flex: 1, minWidth: 120 },
    { field: 'consumptionType', headerName: 'Type', flex: 1, minWidth: 120 },
    { field: 'date', headerName: 'Date', flex: 1, minWidth: 150 },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ScienceIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <ListIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">List Material Consumptions</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">View all material consumption records</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <TextField fullWidth label="Search Material Consumptions" placeholder="Search..." value={searchText} onChange={(e) => setSearchText(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
        </Box>
        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box> : filteredConsumptions.length === 0 ? <Box sx={{ p: 4, textAlign: 'center' }}><Typography variant="body1" color="text.secondary">No material consumptions found</Typography></Box> : <Box sx={{ height: 600, width: '100%' }}><DataGrid rows={filteredConsumptions} columns={columns} getRowId={(row) => row.id} pageSize={10} rowsPerPageOptions={[10, 25, 50]} disableSelectionOnClick sx={{ '& .MuiDataGrid-cell:focus': { outline: 'none' } }} /></Box>}
      </Paper>
    </Container>
  );
};

export default ListMaterialConsumption;


