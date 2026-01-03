import { useState } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Grid, Alert, CircularProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { upsertProposition } from '../../services/propositionService';

const CreateProposition = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ id: null, readyItemId: '', rawMaterialId: '', expectedPercentage: '' });

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
      await upsertProposition(formData);
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
              <TextField fullWidth label="Ready Item ID" name="readyItemId" value={formData.readyItemId} onChange={handleChange} disabled={loading} type="number" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Raw Material ID" name="rawMaterialId" value={formData.rawMaterialId} onChange={handleChange} disabled={loading} type="number" required />
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

