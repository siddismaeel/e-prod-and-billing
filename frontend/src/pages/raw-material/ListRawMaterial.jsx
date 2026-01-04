import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import InventoryIcon from '@mui/icons-material/Inventory';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import { getAllRawMaterials } from '../../services/rawMaterialService';

const ListRawMaterial = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [filteredRawMaterials, setFilteredRawMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredRawMaterials(rawMaterials);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = rawMaterials.filter((material) => {
        return (
          (material.name && material.name.toLowerCase().includes(searchLower)) ||
          (material.code && material.code.toLowerCase().includes(searchLower)) ||
          (material.unit && material.unit.toLowerCase().includes(searchLower)) ||
          (material.description && material.description.toLowerCase().includes(searchLower))
        );
      });
      setFilteredRawMaterials(filtered);
    }
  }, [searchText, rawMaterials]);

  const fetchRawMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllRawMaterials();
      setRawMaterials(data || []);
      setFilteredRawMaterials(data || []);
    } catch (err) {
      console.error('Error fetching raw materials:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch raw materials');
      setRawMaterials([]);
      setFilteredRawMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'code',
      headerName: 'Code',
      flex: 1,
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 1,
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      minWidth: 250,
      sortable: false,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InventoryIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <ListIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            List Raw Materials
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          View and manage all raw materials
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Search Raw Materials"
            placeholder="Search by name, code, unit, or description..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredRawMaterials.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              {searchText ? 'No raw materials found matching your search' : 'No raw materials found'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredRawMaterials}
              columns={columns}
              getRowId={(row) => row.id || row.rawMaterialId}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell:focus': {
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

export default ListRawMaterial;


