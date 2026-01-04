import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Alert, TextField, InputAdornment } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import { getRecipesByReadyItem } from '../../services/productionRecipeService';

const ListProductionRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [readyItemId, setReadyItemId] = useState('');

  useEffect(() => {
    if (readyItemId) {
      fetchRecipes();
    } else {
      setRecipes([]);
      setFilteredRecipes([]);
    }
  }, [readyItemId]);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredRecipes(recipes);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = recipes.filter((recipe) => JSON.stringify(recipe).toLowerCase().includes(searchLower));
      setFilteredRecipes(filtered);
    }
  }, [searchText, recipes]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRecipesByReadyItem(readyItemId);
      setRecipes(data || []);
      setFilteredRecipes(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch production recipes');
      setRecipes([]);
      setFilteredRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'readyItemId', headerName: 'Ready Item ID', flex: 1, minWidth: 150 },
    { field: 'rawMaterialId', headerName: 'Raw Material ID', flex: 1, minWidth: 150 },
    { field: 'quality', headerName: 'Quality', flex: 1, minWidth: 120 },
    { field: 'quantityRequired', headerName: 'Quantity Required', flex: 1, minWidth: 150 },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MenuBookIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <ListIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">List Production Recipes</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">View production recipes by ready item</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <TextField fullWidth label="Ready Item ID" value={readyItemId} onChange={(e) => setReadyItemId(e.target.value)} type="number" placeholder="Enter Ready Item ID to fetch recipes" sx={{ mb: 2 }} />
          <TextField fullWidth label="Search Recipes" placeholder="Search..." value={searchText} onChange={(e) => setSearchText(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
        </Box>
        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box> : !readyItemId ? <Box sx={{ p: 4, textAlign: 'center' }}><Typography variant="body1" color="text.secondary">Please enter a Ready Item ID to view recipes</Typography></Box> : filteredRecipes.length === 0 ? <Box sx={{ p: 4, textAlign: 'center' }}><Typography variant="body1" color="text.secondary">No recipes found</Typography></Box> : <Box sx={{ height: 600, width: '100%' }}><DataGrid rows={filteredRecipes} columns={columns} getRowId={(row) => row.id} pageSize={10} rowsPerPageOptions={[10, 25, 50]} disableSelectionOnClick sx={{ '& .MuiDataGrid-cell:focus': { outline: 'none' } }} /></Box>}
      </Paper>
    </Container>
  );
};

export default ListProductionRecipe;


