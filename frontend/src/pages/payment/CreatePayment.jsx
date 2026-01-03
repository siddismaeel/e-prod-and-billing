import { useState } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Grid, Alert, CircularProgress } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { recordPayment } from '../../services/paymentService';

const CreatePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ customerId: '', orderId: '', orderType: 'SALES', amount: '', paymentDate: new Date().toISOString().split('T')[0], paymentMethod: '', remarks: '' });

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
      await recordPayment(formData);
      setSuccess('Payment recorded successfully!');
      setTimeout(() => setFormData({ customerId: '', orderId: '', orderType: 'SALES', amount: '', paymentDate: new Date().toISOString().split('T')[0], paymentMethod: '', remarks: '' }), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PaymentIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">Record Payment</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">Record a new payment transaction</Typography>
      </Box>
      <Paper sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Customer ID" name="customerId" value={formData.customerId} onChange={handleChange} disabled={loading} type="number" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Order ID" name="orderId" value={formData.orderId} onChange={handleChange} disabled={loading} type="number" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Order Type" name="orderType" value={formData.orderType} onChange={handleChange} disabled={loading} select SelectProps={{ native: true }}>
                <option value="SALES">SALES</option>
                <option value="PURCHASE">PURCHASE</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Amount" name="amount" value={formData.amount} onChange={handleChange} disabled={loading} type="number" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Payment Date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} disabled={loading} type="date" InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Payment Method" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} disabled={loading} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Remarks" name="remarks" value={formData.remarks} onChange={handleChange} disabled={loading} multiline rows={3} />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" startIcon={<ClearIcon />} onClick={() => setFormData({ customerId: '', orderId: '', orderType: 'SALES', amount: '', paymentDate: new Date().toISOString().split('T')[0], paymentMethod: '', remarks: '' })} disabled={loading} size="large">Clear</Button>
                <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />} disabled={loading} size="large">{loading ? 'Saving...' : 'Save'}</Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreatePayment;

