import { useState } from 'react';
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
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { upsertReadyItem } from '../../services/readyItemService';

const CreateReadyItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    code: '',
    unit: '',
    description: '',
    goodsTypeId: null,
  });

  const [errors, setErrors] = useState({
    name: '',
    code: '',
    unit: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (success) setSuccess('');
  };

  const validateForm = () => {
    const newErrors = { name: '', code: '', unit: '' };
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

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
      };

      await upsertReadyItem(payload);
      setSuccess('Ready item saved successfully!');
      setTimeout(() => {
        setFormData({ id: null, name: '', code: '', unit: '', description: '', goodsTypeId: null });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save ready item');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({ id: null, name: '', code: '', unit: '', description: '', goodsTypeId: null });
    setErrors({ name: '', code: '', unit: '' });
    setError('');
    setSuccess('');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ShoppingCartIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">Create Ready Item</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Add a new ready item to the system
        </Typography>
      </Box>

      <Paper sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} required disabled={loading} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Code" name="code" value={formData.code} onChange={handleChange} error={!!errors.code} helperText={errors.code} required disabled={loading} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Unit" name="unit" value={formData.unit} onChange={handleChange} error={!!errors.unit} helperText={errors.unit} required disabled={loading} placeholder="e.g., kg, liter, piece" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} disabled={loading} multiline rows={3} />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" startIcon={<ClearIcon />} onClick={handleClear} disabled={loading} size="large">Clear</Button>
                <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />} disabled={loading} size="large">{loading ? 'Saving...' : 'Save'}</Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateReadyItem;

