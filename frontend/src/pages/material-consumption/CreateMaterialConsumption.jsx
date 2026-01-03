import { useState } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Grid, Alert, CircularProgress } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { recordManualConsumption } from '../../services/materialConsumptionService';

const CreateMaterialConsumption = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ rawMaterialId: '', quantity: '', consumptionType: 'MANUAL', date: new Date().toISOString().split('T')[0], remarks: '' });

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
      await recordManualConsumption(formData);
      setSuccess('Material consumption recorded successfully!');
      setTimeout(() => setFormData({ rawMaterialId: '', quantity: '', consumptionType: 'MANUAL', date: new Date().toISOString().split('T')[0], remarks: '' }), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to record material consumption');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ScienceIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">Record Material Consumption</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">Record manual material consumption</Typography>
      </Box>
      <Paper sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Raw Material ID" name="rawMaterialId" value={formData.rawMaterialId} onChange={handleChange} disabled={loading} type="number" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Quantity" name="quantity" value={formData.quantity} onChange={handleChange} disabled={loading} type="number" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Date" name="date" value={formData.date} onChange={handleChange} disabled={loading} type="date" InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Remarks" name="remarks" value={formData.remarks} onChange={handleChange} disabled={loading} multiline rows={3} />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" startIcon={<ClearIcon />} onClick={() => setFormData({ rawMaterialId: '', quantity: '', consumptionType: 'MANUAL', date: new Date().toISOString().split('T')[0], remarks: '' })} disabled={loading} size="large">Clear</Button>
                <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />} disabled={loading} size="large">{loading ? 'Saving...' : 'Save'}</Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateMaterialConsumption;

