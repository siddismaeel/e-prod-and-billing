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
import ScienceIcon from '@mui/icons-material/Science';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import { recordManualConsumption } from '../../services/materialConsumptionService';
import { getAllRawMaterials } from '../../services/rawMaterialService';
import { getAllReadyItems } from '../../services/readyItemService';

const CreateMaterialConsumption = () => {
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

  // Form state - Ready Item, Quality, Ready Item Quantity, Date at form level
  const [formData, setFormData] = useState({
    readyItemId: '',
    quality: '',
    readyItemQuantity: '',
    date: new Date().toISOString().split('T')[0],
    remarks: '',
  });

  // Raw material items state
  const [rawMaterialItems, setRawMaterialItems] = useState([
    {
      rawMaterialId: '',
      quantity: '',
    },
  ]);

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Quality options
  const qualityOptions = ['M1', 'M2', 'M3'];

  // Fetch dropdown data on component mount
  useEffect(() => {
    fetchReadyItems();
    fetchRawMaterials();
  }, []);

  // Fetch ready items
  const fetchReadyItems = async () => {
    try {
      setLoadingReadyItems(true);
      const data = await getAllReadyItems();
      setReadyItems(data || []);
    } catch (err) {
      console.error('Error fetching ready items:', err);
      // Don't show error for ready items, just log it (optional field)
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

  // Handle form field changes (Ready Item, Quality, Ready Item Quantity, Date, Remarks)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear quality and readyItemQuantity when readyItemId is cleared
    if (name === 'readyItemId' && !value) {
      setFormData((prev) => ({ ...prev, readyItemId: '', quality: '', readyItemQuantity: '' }));
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
        rawMaterialId: '',
        quantity: '',
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

  // Calculate recipe quantity per unit for a specific row
  const calculateRecipeQuantity = (index) => {
    const item = rawMaterialItems[index];
    if (item.quantity && formData.readyItemQuantity &&
        parseFloat(item.quantity) > 0 && parseFloat(formData.readyItemQuantity) > 0) {
      const rawMaterialQty = parseFloat(item.quantity);
      const readyItemQty = parseFloat(formData.readyItemQuantity);
      return (rawMaterialQty / readyItemQty).toFixed(4);
    }
    return null;
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate form level fields
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    // If Ready Item is selected, Quality and Ready Item Quantity are required
    if (formData.readyItemId) {
      if (!formData.quality || !formData.quality.trim()) {
        newErrors.quality = 'Quality is required when Ready Item is selected';
      }
      if (!formData.readyItemQuantity || parseFloat(formData.readyItemQuantity) <= 0) {
        newErrors.readyItemQuantity = 'Ready Item Quantity must be greater than 0';
      }
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

      if (!item.quantity || parseFloat(item.quantity) <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
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
      const promises = rawMaterialItems.map(async (item) => {
        const selectedRawMaterial = rawMaterials.find(rm => rm.id === Number(item.rawMaterialId));
        const unit = selectedRawMaterial ? selectedRawMaterial.unit : null;

        const payload = {
          readyItemId: formData.readyItemId ? Number(formData.readyItemId) : null,
          quality: formData.readyItemId && formData.quality ? formData.quality : null,
          rawMaterialId: Number(item.rawMaterialId),
          quantity: Number(item.quantity),
          readyItemQuantity: formData.readyItemId && formData.readyItemQuantity ? Number(formData.readyItemQuantity) : null,
          unit: unit,
          consumptionType: 'MANUAL',
          date: formData.date,
          remarks: formData.remarks || null,
        };

        return recordManualConsumption(payload);
      });

      await Promise.all(promises);
      
      const recipeCount = formData.readyItemId ? rawMaterialItems.length : 0;
      const consumptionCount = rawMaterialItems.length;
      
      let successMessage = `Successfully recorded ${consumptionCount} material consumption(s)!`;
      if (recipeCount > 0) {
        successMessage += ` ${recipeCount} recipe(s) created/updated.`;
      }
      
      setSuccess(successMessage);

      // Reset form after 2 seconds
      setTimeout(() => {
        handleReset();
      }, 2000);
    } catch (err) {
      console.error('Error saving material consumptions:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to record material consumptions. Please try again.';
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
      readyItemQuantity: '',
      date: new Date().toISOString().split('T')[0],
      remarks: '',
    });
    setRawMaterialItems([
      {
        rawMaterialId: '',
        quantity: '',
      },
    ]);
    setErrors({});
    setError('');
    setSuccess('');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ScienceIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Record Material Consumption
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Record material consumption by adding multiple raw materials for a ready item and quality
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
            {/* Consumption Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
                Consumption Information
              </Typography>
            </Grid>

            {/* Ready Item */}
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={!!errors.readyItemId}
                disabled={loading || loadingReadyItems}
              >
                <InputLabel id="ready-item-select-label">Ready Item (Optional)</InputLabel>
                <Select
                  labelId="ready-item-select-label"
                  id="ready-item-select"
                  name="readyItemId"
                  value={formData.readyItemId}
                  label="Ready Item (Optional)"
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>None</em>
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
                {errors.readyItemId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.readyItemId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Quality - shown only when Ready Item is selected */}
            {formData.readyItemId && (
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
            )}

            {/* Ready Item Quantity - shown only when Ready Item is selected */}
            {formData.readyItemId && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ready Item Quantity"
                  name="readyItemQuantity"
                  value={formData.readyItemQuantity}
                  onChange={handleChange}
                  disabled={loading}
                  type="number"
                  required
                  error={!!errors.readyItemQuantity}
                  helperText={errors.readyItemQuantity}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
            )}

            {/* Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                disabled={loading}
                type="date"
                InputLabelProps={{ shrink: true }}
                required
                error={!!errors.date}
                helperText={errors.date}
              />
            </Grid>

            {/* Remarks */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                disabled={loading}
                multiline
                rows={3}
              />
            </Grid>

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
                  {rawMaterialItems.map((item, index) => {
                    const recipeQty = calculateRecipeQuantity(index);
                    const selectedRawMaterial = rawMaterials.find(rm => rm.id === Number(item.rawMaterialId));
                    return (
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

                            {/* Raw Material Quantity */}
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Raw Material Quantity"
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleRawMaterialChange(index, 'quantity', e.target.value)
                                }
                                error={!!errors[`item_${index}_quantity`]}
                                helperText={errors[`item_${index}_quantity`]}
                                disabled={loading}
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>

                            {/* Calculated Recipe Quantity */}
                            {formData.readyItemId && recipeQty && (
                              <Grid item xs={12}>
                                <Alert severity="info" sx={{ mt: 1 }}>
                                  <Typography variant="body2">
                                    <strong>Recipe Quantity Per Unit:</strong> {recipeQty} {selectedRawMaterial?.unit || ''} per unit
                                    {formData.quality && ` (Quality: ${formData.quality})`}
                                  </Typography>
                                </Alert>
                              </Grid>
                            )}
                          </Grid>
                        </CardContent>
                      </Card>
                    );
                  })}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Tooltip title="Add Raw Material">
                      <IconButton
                        color="primary"
                        onClick={handleAddRawMaterial}
                        disabled={loading}
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
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Raw Material Quantity</TableCell>
                        {formData.readyItemId && (
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Recipe Qty/Unit</TableCell>
                        )}
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rawMaterialItems.map((item, index) => {
                        const recipeQty = calculateRecipeQuantity(index);
                        const selectedRawMaterial = rawMaterials.find(rm => rm.id === Number(item.rawMaterialId));
                        return (
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
                                value={item.quantity}
                                onChange={(e) =>
                                  handleRawMaterialChange(index, 'quantity', e.target.value)
                                }
                                error={!!errors[`item_${index}_quantity`]}
                                disabled={loading}
                                inputProps={{ min: 0, step: 0.01 }}
                                sx={{ width: 150 }}
                              />
                              {errors[`item_${index}_quantity`] && (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                  {errors[`item_${index}_quantity`]}
                                </Typography>
                              )}
                            </TableCell>
                            {formData.readyItemId && (
                              <TableCell>
                                {recipeQty ? (
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {recipeQty} {selectedRawMaterial?.unit || ''}
                                  </Typography>
                                ) : (
                                  <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                                    Enter quantities
                                  </Typography>
                                )}
                              </TableCell>
                            )}
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
                        );
                      })}
                      {/* Add button as last row */}
                      <TableRow>
                        <TableCell 
                          colSpan={formData.readyItemId ? 4 : 3} 
                          align="center"
                        >
                          <Tooltip title="Add Raw Material">
                            <IconButton
                              color="primary"
                              onClick={handleAddRawMaterial}
                              disabled={loading}
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
                  {loading ? 'Saving...' : 'Save Consumptions'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateMaterialConsumption;
