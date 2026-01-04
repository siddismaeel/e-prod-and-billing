import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Grid, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import FactoryIcon from '@mui/icons-material/Factory';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { produceReadyItem } from '../../services/productionService';
import { getAllReadyItems } from '../../services/readyItemService';

const CreateProduction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ readyItemId: '', quantity: '', quality: '', productionDate: new Date().toISOString().split('T')[0] });

  // Ready items dropdown data
  const [readyItems, setReadyItems] = useState([]);
  const [loadingReadyItems, setLoadingReadyItems] = useState(true);

  // Quality options
  const qualityOptions = ['M1', 'M2', 'M3'];

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Prepare payload with proper data types
      const payload = {
        readyItemId: formData.readyItemId ? Number(formData.readyItemId) : null,
        quantityProduced: formData.quantity ? Number(formData.quantity) : null,
        quality: formData.quality,
        productionDate: formData.productionDate,
      };
      
      await produceReadyItem(payload);
      setSuccess('Production record created successfully!');
      setTimeout(() => setFormData({ readyItemId: '', quantity: '', quality: '', productionDate: new Date().toISOString().split('T')[0] }), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create production record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FactoryIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">Create Production</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">Record a new production</Typography>
      </Box>
      <Paper sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!error && !formData.readyItemId} disabled={loading || loadingReadyItems}>
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
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Quantity" name="quantity" value={formData.quantity} onChange={handleChange} disabled={loading} type="number" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!error && !formData.quality} disabled={loading}>
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
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Production Date" name="productionDate" value={formData.productionDate} onChange={handleChange} disabled={loading} type="date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" startIcon={<ClearIcon />} onClick={() => setFormData({ readyItemId: '', quantity: '', quality: '', productionDate: new Date().toISOString().split('T')[0] })} disabled={loading} size="large">Clear</Button>
                <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />} disabled={loading} size="large">{loading ? 'Saving...' : 'Save'}</Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateProduction;

