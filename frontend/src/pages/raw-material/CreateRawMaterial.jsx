import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { upsertRawMaterial } from '../../services/rawMaterialService';

const CreateRawMaterial = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Unit options for dropdown
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

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    code: '',
    unit: '',
    description: '',
    goodsTypeId: null,
    openingStock: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    code: '',
    unit: '',
    openingStock: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    if (success) {
      setSuccess('');
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      code: '',
      unit: '',
      openingStock: '',
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
      isValid = false;
    }

    if (!formData.unit.trim()) {
      newErrors.unit = 'Unit is required';
      isValid = false;
    }

    // Validate opening stock
    if (formData.openingStock && (isNaN(formData.openingStock) || Number(formData.openingStock) < 0)) {
      newErrors.openingStock = 'Opening stock must be a positive number or zero';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const payload = {
        id: formData.id || null,
        name: formData.name.trim(),
        code: formData.code.trim(),
        unit: formData.unit.trim(),
        description: formData.description.trim() || null,
        goodsTypeId: formData.goodsTypeId || null,
        openingStock: formData.openingStock ? Number(formData.openingStock) : null,
      };

      await upsertRawMaterial(payload);
      setSuccess('Raw material saved successfully!');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          id: null,
          name: '',
          code: '',
          unit: '',
          description: '',
          goodsTypeId: null,
          openingStock: '',
        });
      }, 2000);
    } catch (err) {
      console.error('Error saving raw material:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save raw material');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      id: null,
      name: '',
      code: '',
      unit: '',
      description: '',
      goodsTypeId: null,
      openingStock: '',
    });
    setErrors({
      name: '',
      code: '',
      unit: '',
      openingStock: '',
    });
    setError('');
    setSuccess('');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InventoryIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Create Raw Material
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Add a new raw material to the system
        </Typography>
      </Box>

      <Paper sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                error={!!errors.code}
                helperText={errors.code}
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.unit} disabled={loading}>
                <InputLabel id="unit-select-label">Unit</InputLabel>
                <Select
                  labelId="unit-select-label"
                  id="unit-select"
                  name="unit"
                  value={formData.unit}
                  label="Unit"
                  onChange={handleChange}
                >
                  {unitOptions.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
                {errors.unit && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.unit}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Opening Stock"
                name="openingStock"
                value={formData.openingStock}
                onChange={handleChange}
                error={!!errors.openingStock}
                helperText={errors.openingStock || 'Initial stock quantity (optional)'}
                disabled={loading}
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleClear}
                  disabled={loading}
                  size="large"
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                  size="large"
                >
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateRawMaterial;

