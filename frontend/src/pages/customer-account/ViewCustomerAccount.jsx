import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Grid, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getAccount, recalculateBalance } from '../../services/customerAccountService';
import { getCustomersForDropdown } from '../../services/customerService';

const ViewCustomerAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [account, setAccount] = useState(null);

  // Customers dropdown data
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const data = await getCustomersForDropdown();
      setCustomers(data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers. Please refresh the page.');
    } finally {
      setLoadingCustomers(false);
    }
  };

  const fetchAccount = async () => {
    if (!customerId) return;
    try {
      setLoading(true);
      setError('');
      const id = Number(customerId);
      const data = await getAccount(id);
      setAccount(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch customer account');
      setAccount(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = async () => {
    if (!customerId) return;
    try {
      setLoading(true);
      setError('');
      const id = Number(customerId);
      const data = await recalculateBalance(id);
      setAccount(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to recalculate balance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccountCircleIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">View Customer Account</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">View customer account details</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <FormControl fullWidth disabled={loadingCustomers}>
              <InputLabel id="customer-select-label">Customer</InputLabel>
              <Select
                labelId="customer-select-label"
                id="customer-select"
                value={customerId}
                label="Customer"
                onChange={(e) => setCustomerId(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Select Customer</em>
                </MenuItem>
                {loadingCustomers ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Loading customers...
                  </MenuItem>
                ) : customers.length === 0 ? (
                  <MenuItem disabled>No customers available</MenuItem>
                ) : (
                  customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button fullWidth variant="contained" onClick={fetchAccount} disabled={loading || !customerId} sx={{ height: '56px' }}>Get Account</Button>
          </Grid>
          {account && (
            <>
              <Grid item xs={12}>
                <Paper sx={{ p: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <Typography variant="h6">Customer ID: {account.customerId}</Typography>
                  <Typography variant="h6">Balance: {account.balance || 0}</Typography>
                  <Typography variant="body1">Total Credit: {account.totalCredit || 0}</Typography>
                  <Typography variant="body1">Total Debit: {account.totalDebit || 0}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" onClick={handleRecalculate} disabled={loading}>Recalculate Balance</Button>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ViewCustomerAccount;

