import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Grid, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { upsertProposition } from '../../services/propositionService';
import { getAllReadyItems } from '../../services/readyItemService';
import { getAllRawMaterials } from '../../services/rawMaterialService';

const CreateProposition = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ id: null, readyItemId: '', rawMaterialId: '', expectedPercentage: '' });

  // Dropdown data
  const [readyItems, setReadyItems] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [loadingReadyItems, setLoadingReadyItems] = useState(true);
  const [loadingRawMaterials, setLoadingRawMaterials] = useState(true);

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
        id: formData.id || null,
        readyItemId: formData.readyItemId ? Number(formData.readyItemId) : null,
        rawMaterialId: formData.rawMaterialId ? Number(formData.rawMaterialId) : null,
        expectedPercentage: formData.expectedPercentage ? Number(formData.expectedPercentage) : null,
      };
      
      await upsertProposition(payload);
      setSuccess('Proposition saved successfully!');
      setTimeout(() => setFormData({ id: null, readyItemId: '', rawMaterialId: '', expectedPercentage: '' }), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save proposition');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrendingUpIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">Create Proposition</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">Create a new proposition</Typography>
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
              <FormControl fullWidth required error={!!error && !formData.rawMaterialId} disabled={loading || loadingRawMaterials}>
                <InputLabel id="raw-material-select-label">Raw Material</InputLabel>
                <Select
                  labelId="raw-material-select-label"
                  id="raw-material-select"
                  name="rawMaterialId"
                  value={formData.rawMaterialId}
                  label="Raw Material"
                  onChange={handleChange}
                >
                  {loadingRawMaterials ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading raw materials...
                    </MenuItem>
                  ) : rawMaterials.length === 0 ? (
                    <MenuItem disabled>No raw materials available</MenuItem>
                  ) : (
                    rawMaterials.map((material) => (
                      <MenuItem key={material.id} value={material.id}>
                        {material.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Expected Percentage" name="expectedPercentage" value={formData.expectedPercentage} onChange={handleChange} disabled={loading} type="number" required />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" startIcon={<ClearIcon />} onClick={() => setFormData({ id: null, readyItemId: '', rawMaterialId: '', expectedPercentage: '' })} disabled={loading} size="large">Clear</Button>
                <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />} disabled={loading} size="large">{loading ? 'Saving...' : 'Save'}</Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateProposition;

