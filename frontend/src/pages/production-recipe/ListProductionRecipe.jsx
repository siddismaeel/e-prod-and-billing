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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import { getRecipesByReadyItem, getRecipesByRawMaterial } from '../../services/productionRecipeService';
import { getAllRawMaterials } from '../../services/rawMaterialService';
import { getAllReadyItems } from '../../services/readyItemService';

const ListProductionRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [readyItemId, setReadyItemId] = useState('');
  const [rawMaterialId, setRawMaterialId] = useState('');
  const [rawMaterials, setRawMaterials] = useState([]);
  const [loadingRawMaterials, setLoadingRawMaterials] = useState(true);
  const [readyItems, setReadyItems] = useState([]);
  const [loadingReadyItems, setLoadingReadyItems] = useState(true);

  // Fetch raw materials and ready items on mount
  useEffect(() => {
    fetchRawMaterials();
    fetchReadyItems();
  }, []);

  // Fetch recipes when ready item ID or raw material ID changes
  useEffect(() => {
    if (readyItemId || rawMaterialId) {
      fetchRecipes();
    } else {
      setRecipes([]);
      setFilteredRecipes([]);
    }
  }, [readyItemId, rawMaterialId]);

  // Filter recipes by search text
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredRecipes(recipes);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = recipes.filter((recipe) => JSON.stringify(recipe).toLowerCase().includes(searchLower));
      setFilteredRecipes(filtered);
    }
  }, [searchText, recipes]);

  const fetchRawMaterials = async () => {
    try {
      setLoadingRawMaterials(true);
      const data = await getAllRawMaterials();
      setRawMaterials(data || []);
    } catch (err) {
      console.error('Error fetching raw materials:', err);
      setError('Failed to load raw materials');
    } finally {
      setLoadingRawMaterials(false);
    }
  };

  const fetchReadyItems = async () => {
    try {
      setLoadingReadyItems(true);
      const data = await getAllReadyItems();
      setReadyItems(data || []);
    } catch (err) {
      console.error('Error fetching ready items:', err);
      setError('Failed to load ready items');
    } finally {
      setLoadingReadyItems(false);
    }
  };

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      let data = [];
      
      // Prioritize raw material filter if both are provided
      if (rawMaterialId) {
        data = await getRecipesByRawMaterial(rawMaterialId);
      } else if (readyItemId) {
        data = await getRecipesByReadyItem(readyItemId);
      }
      
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
    { field: 'readyItemName', headerName: 'Ready Item', flex: 1, minWidth: 150 },
    { field: 'rawMaterialName', headerName: 'Raw Material', flex: 1, minWidth: 150 },
    { field: 'quality', headerName: 'Quality', flex: 1, minWidth: 120 },
    { field: 'quantityRequired', headerName: 'Quantity Required', flex: 1, minWidth: 150 },
  ];

  const hasFilter = readyItemId || rawMaterialId;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MenuBookIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <ListIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">List Production Recipes</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">View production recipes by ready item or raw material</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={loadingReadyItems}>
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
                    <em>All</em>
                  </MenuItem>
                  {readyItems.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={loadingRawMaterials}>
                <InputLabel id="raw-material-select-label">Raw Material</InputLabel>
                <Select
                  labelId="raw-material-select-label"
                  id="raw-material-select"
                  value={rawMaterialId}
                  label="Raw Material"
                  onChange={(e) => setRawMaterialId(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  {rawMaterials.map((material) => (
                    <MenuItem key={material.id} value={material.id}>
                      {material.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Search Recipes" 
                placeholder="Search..." 
                value={searchText} 
                onChange={(e) => setSearchText(e.target.value)} 
                InputProps={{ 
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ) 
                }} 
              />
            </Grid>
          </Grid>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : !hasFilter ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Please select a Ready Item or Raw Material to view recipes
            </Typography>
          </Box>
        ) : filteredRecipes.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">No recipes found</Typography>
          </Box>
        ) : (
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid 
              rows={filteredRecipes} 
              columns={columns} 
              getRowId={(row) => row.id} 
              pageSize={10} 
              rowsPerPageOptions={[10, 25, 50]} 
              disableSelectionOnClick 
              sx={{ '& .MuiDataGrid-cell:focus': { outline: 'none' } }} 
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ListProductionRecipe;
