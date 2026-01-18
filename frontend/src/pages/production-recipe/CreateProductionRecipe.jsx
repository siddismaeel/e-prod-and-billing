import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Divider,
  Card,
  CardContent,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import { upsertRecipe, getRecipesByQuality } from '../../services/productionRecipeService';
import { getAllReadyItems } from '../../services/readyItemService';
import { getAllRawMaterials } from '../../services/rawMaterialService';

const CreateProductionRecipe = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dropdown data
  const [readyItems, setReadyItems] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [loadingReadyItems, setLoadingReadyItems] = useState(true);
  const [loadingRawMaterials, setLoadingRawMaterials] = useState(true);

  // Form state - Ready Item and Quality at form level
  const [formData, setFormData] = useState({
    readyItemId: '',
    quality: '',
  });

  // Raw material items state
  const [rawMaterialItems, setRawMaterialItems] = useState([
    {
      id: null,
      rawMaterialId: '',
      quantityRequired: '',
      unit: '',
    },
  ]);

  // Existing recipes state
  const [existingRecipes, setExistingRecipes] = useState([]);
  const [loadingExistingRecipes, setLoadingExistingRecipes] = useState(false);

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Quality options
  const qualityOptions = ['M1', 'M2', 'M3'];

  // Unit options
  const unitOptions = [
    'kg',
    'g',
    'ton',
    'liter',
    'ml',
    'piece',
    'box',
    'pack',
    'meter',
    'cm',
    'm²',
    'm³',
    'bag',
    'roll',
    'sheet',
  ];

  // Fetch dropdown data on component mount
  useEffect(() => {
    fetchReadyItems();
    fetchRawMaterials();
  }, []);

  // Load existing recipes when ready item and quality are selected
  useEffect(() => {
    if (formData.readyItemId && formData.quality) {
      loadExistingRecipes();
    } else {
      setExistingRecipes([]);
    }
  }, [formData.readyItemId, formData.quality]);

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

  // Fetch raw materials
  const fetchRawMaterials = async () => {
    try {
      setLoadingRawMaterials(true);
      const data = await getAllRawMaterials();
      setRawMaterials(data || []);
    } catch (err) {
      console.error('Error fetching raw materials:', err);
      setError('Failed to load raw materials. Please refresh the page.');
    } finally {
      setLoadingRawMaterials(false);
    }
  };

  // Load existing recipes for the selected ready item and quality
  const loadExistingRecipes = async () => {
    try {
      setLoadingExistingRecipes(true);
      const data = await getRecipesByQuality(
        Number(formData.readyItemId),
        formData.quality
      );
      setExistingRecipes(data || []);
    } catch (err) {
      console.error('Error fetching existing recipes:', err);
      // Don't show error for this, just log it
    } finally {
      setLoadingExistingRecipes(false);
    }
  };

  // Handle form field changes (Ready Item and Quality)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    if (success) setSuccess('');
  };

  // Handle raw material item field changes
  const handleRawMaterialChange = (index, field, value) => {
    const updatedItems = [...rawMaterialItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Clear error for this field
    const errorKey = `item_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }

    setRawMaterialItems(updatedItems);
  };

  // Add new raw material item
  const handleAddRawMaterial = () => {
    setRawMaterialItems([
      ...rawMaterialItems,
      {
        id: null,
        rawMaterialId: '',
        quantityRequired: '',
        unit: '',
      },
    ]);
  };

  // Remove raw material item
  const handleRemoveRawMaterial = (index) => {
    if (rawMaterialItems.length > 1) {
      const updatedItems = rawMaterialItems.filter((_, i) => i !== index);
      setRawMaterialItems(updatedItems);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate form level fields
    if (!formData.readyItemId) {
      newErrors.readyItemId = 'Ready item is required';
    }
    if (!formData.quality) {
      newErrors.quality = 'Quality is required';
    }

    // Validate raw material items
    if (rawMaterialItems.length === 0) {
      newErrors.rawMaterialItems = 'At least one raw material is required';
    }

    // Track raw material IDs to prevent duplicates
    const rawMaterialIds = new Set();

    rawMaterialItems.forEach((item, index) => {
      if (!item.rawMaterialId) {
        newErrors[`item_${index}_rawMaterialId`] = 'Raw material is required';
      } else {
        const rawMaterialId = Number(item.rawMaterialId);
        if (rawMaterialIds.has(rawMaterialId)) {
          newErrors[`item_${index}_rawMaterialId`] = 'Duplicate raw material selected';
        } else {
          rawMaterialIds.add(rawMaterialId);
        }
      }

      if (!item.quantityRequired || item.quantityRequired <= 0) {
        newErrors[`item_${index}_quantityRequired`] = 'Quantity must be greater than 0';
      }

      if (!item.unit) {
        newErrors[`item_${index}_unit`] = 'Unit is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
      setError('');
      setSuccess('');
      
    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      // Submit all raw material entries
      const promises = rawMaterialItems.map((item) => {
      const payload = {
          id: item.id || null,
          readyItemId: Number(formData.readyItemId),
          rawMaterialId: Number(item.rawMaterialId),
        quality: formData.quality,
          quantityRequired: Number(item.quantityRequired),
          unit: item.unit,
        };
        return upsertRecipe(payload);
      });

      await Promise.all(promises);
      setSuccess(`Successfully saved ${rawMaterialItems.length} recipe(s)!`);

      // Reset form after 2 seconds
      setTimeout(() => {
        handleReset();
      }, 2000);
    } catch (err) {
      console.error('Error saving production recipes:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to save production recipes. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      readyItemId: '',
      quality: '',
    });
    setRawMaterialItems([
      {
        id: null,
        rawMaterialId: '',
        quantityRequired: '',
        unit: '',
      },
    ]);
    setExistingRecipes([]);
    setErrors({});
    setError('');
    setSuccess('');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MenuBookIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Create Production Recipe
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Create production recipes by adding multiple raw materials for a ready item and quality
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Recipe Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
                Recipe Information
              </Typography>
            </Grid>

            {/* Ready Item */}
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                required
                error={!!errors.readyItemId}
                disabled={loading || loadingReadyItems}
              >
                <InputLabel id="ready-item-select-label">Ready Item</InputLabel>
                <Select
                  labelId="ready-item-select-label"
                  id="ready-item-select"
                  name="readyItemId"
                  value={formData.readyItemId}
                  label="Ready Item"
                  onChange={handleChange}
                >
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
                {errors.readyItemId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.readyItemId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Quality */}
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                required
                error={!!errors.quality}
                disabled={loading}
              >
                <InputLabel id="quality-select-label">Quality</InputLabel>
                <Select
                  labelId="quality-select-label"
                  id="quality-select"
                  name="quality"
                  value={formData.quality}
                  label="Quality"
                  onChange={handleChange}
                >
                  {qualityOptions.map((quality) => (
                    <MenuItem key={quality} value={quality}>
                      {quality}
                    </MenuItem>
                  ))}
                </Select>
                {errors.quality && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.quality}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Existing Recipes Section */}
            {formData.readyItemId && formData.quality && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>
                    Existing Recipes
                  </Typography>
                  {loadingExistingRecipes ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : existingRecipes.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No existing recipes found for this ready item and quality combination.
                    </Typography>
                  ) : (
                    <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: 'grey.100' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Raw Material</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Quantity Required</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Unit</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {existingRecipes.map((recipe) => {
                            const rawMaterial = rawMaterials.find((rm) => rm.id === recipe.rawMaterialId);
                            return (
                              <TableRow key={recipe.id}>
                                <TableCell>{rawMaterial ? rawMaterial.name : `ID: ${recipe.rawMaterialId}`}</TableCell>
                                <TableCell>{recipe.quantityRequired}</TableCell>
                                <TableCell>{recipe.unit}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              </Grid>
            )}

            {/* Raw Materials Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
                Raw Materials
              </Typography>
            </Grid>

            <Grid item xs={12}>
              {isMobile ? (
                // Mobile Card Layout
                <Box>
                  {rawMaterialItems.map((item, index) => (
                    <Card key={index} sx={{ mb: 2, boxShadow: 2 }}>
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Typography variant="h6" sx={{ color: 'primary.main' }}>
                            Raw Material {index + 1}
                          </Typography>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveRawMaterial(index)}
                              disabled={loading || rawMaterialItems.length === 1}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Grid container spacing={2}>
                          {/* Raw Material */}
                          <Grid item xs={12}>
                            <FormControl
                              fullWidth
                              error={!!errors[`item_${index}_rawMaterialId`]}
                              disabled={loading || loadingRawMaterials}
                            >
                              <InputLabel>Raw Material</InputLabel>
                              <Select
                                value={item.rawMaterialId}
                                onChange={(e) =>
                                  handleRawMaterialChange(index, 'rawMaterialId', e.target.value)
                                }
                                label="Raw Material"
                                displayEmpty
                              >
                                <MenuItem value="">
                                  <em>Select Raw Material</em>
                                </MenuItem>
                                {rawMaterials.map((rm) => (
                                  <MenuItem key={rm.id} value={rm.id}>
                                    {rm.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            {errors[`item_${index}_rawMaterialId`] && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 0.5, display: 'block' }}
                              >
                                {errors[`item_${index}_rawMaterialId`]}
                              </Typography>
                            )}
                          </Grid>

                          {/* Quantity Required */}
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Quantity Required"
                              type="number"
                              value={item.quantityRequired}
                              onChange={(e) =>
                                handleRawMaterialChange(index, 'quantityRequired', e.target.value)
                              }
                              error={!!errors[`item_${index}_quantityRequired`]}
                              helperText={errors[`item_${index}_quantityRequired`]}
                              disabled={loading}
                              inputProps={{ min: 0, step: 0.01 }}
                            />
                          </Grid>

                          {/* Unit */}
                          <Grid item xs={12} sm={6}>
                            <FormControl
                              fullWidth
                              error={!!errors[`item_${index}_unit`]}
                              disabled={loading}
                            >
                              <InputLabel>Unit</InputLabel>
                <Select
                                value={item.unit}
                                onChange={(e) => handleRawMaterialChange(index, 'unit', e.target.value)}
                  label="Unit"
                                displayEmpty
                              >
                                <MenuItem value="">
                                  <em>Select Unit</em>
                                </MenuItem>
                                {unitOptions.map((unit) => (
                                  <MenuItem key={unit} value={unit}>
                                    {unit}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            {errors[`item_${index}_unit`] && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 0.5, display: 'block' }}
                              >
                                {errors[`item_${index}_unit`]}
                              </Typography>
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Tooltip title="Add Raw Material">
                      <IconButton
                        color="primary"
                        onClick={handleAddRawMaterial}
                        disabled={loading || !formData.readyItemId || !formData.quality}
                        size="large"
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {errors.rawMaterialItems && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.rawMaterialItems}
                    </Typography>
                  )}
                </Box>
              ) : (
                // Desktop Table Layout
                <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'primary.main' }}>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Raw Material</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity Required</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Unit</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rawMaterialItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <FormControl
                              fullWidth
                              size="small"
                              error={!!errors[`item_${index}_rawMaterialId`]}
                            >
                              <Select
                                value={item.rawMaterialId}
                                onChange={(e) =>
                                  handleRawMaterialChange(index, 'rawMaterialId', e.target.value)
                                }
                                disabled={loading || loadingRawMaterials}
                                displayEmpty
                              >
                                <MenuItem value="">
                                  <em>Select</em>
                                </MenuItem>
                                {rawMaterials.map((rm) => (
                                  <MenuItem key={rm.id} value={rm.id}>
                                    {rm.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            {errors[`item_${index}_rawMaterialId`] && (
                              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                {errors[`item_${index}_rawMaterialId`]}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={item.quantityRequired}
                              onChange={(e) =>
                                handleRawMaterialChange(index, 'quantityRequired', e.target.value)
                              }
                              error={!!errors[`item_${index}_quantityRequired`]}
                              disabled={loading}
                              inputProps={{ min: 0, step: 0.01 }}
                              sx={{ width: 150 }}
                            />
                            {errors[`item_${index}_quantityRequired`] && (
                              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                {errors[`item_${index}_quantityRequired`]}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <FormControl fullWidth size="small" error={!!errors[`item_${index}_unit`]}>
                              <Select
                                value={item.unit}
                                onChange={(e) => handleRawMaterialChange(index, 'unit', e.target.value)}
                                disabled={loading}
                                displayEmpty
                              >
                                <MenuItem value="">
                                  <em>Select</em>
                                </MenuItem>
                  {unitOptions.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
                            {errors[`item_${index}_unit`] && (
                              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                {errors[`item_${index}_unit`]}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveRawMaterial(index)}
                                disabled={loading || rawMaterialItems.length === 1}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Add button as last row */}
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Tooltip title="Add Raw Material">
                            <IconButton
                              color="primary"
                              onClick={handleAddRawMaterial}
                              disabled={loading || !formData.readyItemId || !formData.quality}
                            >
                              <AddIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {errors.rawMaterialItems && !isMobile && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                  {errors.rawMaterialItems}
                </Typography>
              )}
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'flex-end',
                  mt: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ClearIcon />}
                  onClick={handleReset}
                  disabled={loading}
                  fullWidth={isMobile}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                  fullWidth={isMobile}
                >
                  {loading ? 'Saving...' : 'Save Recipes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateProductionRecipe;
