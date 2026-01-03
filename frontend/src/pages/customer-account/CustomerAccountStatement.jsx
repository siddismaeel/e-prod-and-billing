import { useState } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Grid, Alert, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { getAccountStatement, getPaymentHistory } from '../../services/customerAccountService';

const CustomerAccountStatement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [statement, setStatement] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const fetchStatement = async () => {
    if (!customerId) return;
    try {
      setLoading(true);
      setError('');
      const data = await getAccountStatement(customerId, startDate, endDate);
      setStatement(data);
      const trans = await getPaymentHistory(customerId);
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
            <TextField fullWidth label="Customer ID" value={customerId} onChange={(e) => setCustomerId(e.target.value)} type="number" />
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

