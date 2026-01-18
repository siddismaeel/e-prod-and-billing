import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Alert, TextField, InputAdornment } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import FactoryIcon from '@mui/icons-material/Factory';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import { getAllProductions } from '../../services/productionService';

const ListProduction = () => {
  const [productions, setProductions] = useState([]);
  const [filteredProductions, setFilteredProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchProductions();
  }, []);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredProductions(productions);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = productions.filter((prod) => JSON.stringify(prod).toLowerCase().includes(searchLower));
      setFilteredProductions(filtered);
    }
  }, [searchText, productions]);

  const fetchProductions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProductions();
      setProductions(data || []);
      setFilteredProductions(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch productions');
      setProductions([]);
      setFilteredProductions([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'readyItemName', headerName: 'Ready Item', flex: 1, minWidth: 150 },
    { 
      field: 'quantityProduced', 
      headerName: 'Quantity', 
      flex: 1, 
      minWidth: 120,
      valueGetter: (value, row) => row.quantityProduced || 0,
      renderCell: (params) => {
        const quantity = params.value || 0;
        const unit = params.row.unit || '';
        return `${Number(quantity).toFixed(2)} ${unit}`.trim();
      }
    },
    { field: 'quality', headerName: 'Quality', flex: 1, minWidth: 120 },
    { field: 'productionDate', headerName: 'Production Date', flex: 1, minWidth: 150 },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FactoryIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <ListIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">List Productions</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">View all production records</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <TextField fullWidth label="Search Productions" placeholder="Search..." value={searchText} onChange={(e) => setSearchText(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
        </Box>
        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box> : filteredProductions.length === 0 ? <Box sx={{ p: 4, textAlign: 'center' }}><Typography variant="body1" color="text.secondary">No productions found</Typography></Box> : <Box sx={{ height: 600, width: '100%' }}><DataGrid rows={filteredProductions} columns={columns} getRowId={(row) => row.id} pageSize={10} rowsPerPageOptions={[10, 25, 50]} disableSelectionOnClick sx={{ '& .MuiDataGrid-cell:focus': { outline: 'none' } }} /></Box>}
      </Paper>
    </Container>
  );
};

export default ListProduction;


