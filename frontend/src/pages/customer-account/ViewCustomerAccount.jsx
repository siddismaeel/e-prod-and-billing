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
                <Paper sx={{ p: 3, bgcolor: 'primary.light', color: 'primary.contrastText', mb: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    {account.customerName || `Customer ID: ${account.customerId}`}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                    Customer ID: {account.customerId}
                  </Typography>
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.3)' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Balance: ₹{Number(account.balance || account.currentBalance || 0).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {Number(account.balance || account.currentBalance || 0) >= 0 
                        ? 'Customer owes you' 
                        : 'You owe customer'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
                    Account Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Opening Balance</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                        ₹{Number(account.openingBalance || 0).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Current Balance</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                        ₹{Number(account.currentBalance || 0).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Total Receivable</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2, color: 'success.main' }}>
                        ₹{Number(account.totalReceivable || account.totalCredit || 0).toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        (Money owed TO you from sales orders)
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Total Payable</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2, color: 'error.main' }}>
                        ₹{Number(account.totalPayable || account.totalDebit || 0).toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        (Money YOU owe from purchase orders)
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Total Paid</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2, color: 'success.main' }}>
                        ₹{Number(account.totalPaid || 0).toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        (Payments received from customer)
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Total Paid Out</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2, color: 'error.main' }}>
                        ₹{Number(account.totalPaidOut || 0).toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        (Payments made to customer as supplier)
                      </Typography>
                    </Grid>
                    {account.lastTransactionDate && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Last Transaction Date</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {new Date(account.lastTransactionDate).toLocaleDateString()}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button variant="outlined" onClick={handleRecalculate} disabled={loading}>
                    {loading ? <CircularProgress size={20} /> : 'Recalculate Balance'}
                  </Button>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ViewCustomerAccount;

