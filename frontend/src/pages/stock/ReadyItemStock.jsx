import { useState } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Grid, Alert, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getCurrentStock, getStockHistory } from '../../services/readyItemStockService';

const ReadyItemStock = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [readyItemId, setReadyItemId] = useState('');
  const [currentStock, setCurrentStock] = useState(null);
  const [stockHistory, setStockHistory] = useState([]);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchCurrentStock = async () => {
    if (!readyItemId) return;
    try {
      setLoading(true);
      setError('');
      const stock = await getCurrentStock(readyItemId);
      setCurrentStock(stock);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch current stock');
    } finally {
      setLoading(false);
    }
  };

  const fetchStockHistory = async () => {
    if (!readyItemId) return;
    try {
      setLoading(true);
      setError('');
      const history = await getStockHistory(readyItemId, startDate, endDate);
      setStockHistory(history || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch stock history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ShoppingCartIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">Ready Item Stock</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">View ready item stock</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Ready Item ID" value={readyItemId} onChange={(e) => setReadyItemId(e.target.value)} type="number" />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button fullWidth variant="contained" onClick={fetchCurrentStock} disabled={loading || !readyItemId} sx={{ height: '56px' }}>Get Current Stock</Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button fullWidth variant="outlined" onClick={fetchStockHistory} disabled={loading || !readyItemId} sx={{ height: '56px' }}>Get History</Button>
          </Grid>

          {currentStock !== null && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <Typography variant="h6">Current Stock: {currentStock}</Typography>
              </Paper>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" InputLabelProps={{ shrink: true }} />
          </Grid>

          {stockHistory.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Stock History</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Quality</TableCell>
                      <TableCell>Opening Stock</TableCell>
                      <TableCell>Closing Stock</TableCell>
                      <TableCell>Quantity Produced</TableCell>
                      <TableCell>Quantity Sold</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stockHistory.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.stockDate}</TableCell>
                        <TableCell>{entry.quality}</TableCell>
                        <TableCell>{entry.openingStock}</TableCell>
                        <TableCell>{entry.closingStock}</TableCell>
                        <TableCell>{entry.quantityProduced}</TableCell>
                        <TableCell>{entry.quantitySold}</TableCell>
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

export default ReadyItemStock;

