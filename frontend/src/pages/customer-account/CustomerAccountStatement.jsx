import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Grid, Alert, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { getAccountStatement, getPaymentHistory } from '../../services/customerAccountService';
import { getCustomersForDropdown } from '../../services/customerService';

const CustomerAccountStatement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [statement, setStatement] = useState(null);
  const [transactions, setTransactions] = useState([]);

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

  const fetchStatement = async () => {
    if (!customerId) return;
    try {
      setLoading(true);
      setError('');
      const id = Number(customerId);
      const data = await getAccountStatement(id, startDate, endDate);
      setStatement(data);
      const trans = await getPaymentHistory(id);
      setTransactions(trans || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch account statement');
      setStatement(null);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ReceiptLongIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">Customer Account Statement</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">View customer account statement</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button fullWidth variant="contained" onClick={fetchStatement} disabled={loading || !customerId} sx={{ height: '56px' }}>Get Statement</Button>
          </Grid>

          {statement && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: 'primary.light', color: 'primary.contrastText', mb: 3 }}>
                <Typography variant="h6">Opening Balance: {statement.openingBalance || 0}</Typography>
                <Typography variant="h6">Closing Balance: {statement.closingBalance || 0}</Typography>
                <Typography variant="body1">Total Credit: {statement.totalCredit || 0}</Typography>
                <Typography variant="body1">Total Debit: {statement.totalDebit || 0}</Typography>
              </Paper>
            </Grid>
          )}

          {transactions.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Payment History</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Payment Method</TableCell>
                      <TableCell>Remarks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.paymentDate}</TableCell>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>{transaction.paymentMethod}</TableCell>
                        <TableCell>{transaction.remarks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default CustomerAccountStatement;

