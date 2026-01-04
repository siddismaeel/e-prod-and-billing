import { useState } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Grid, Alert, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import SearchIcon from '@mui/icons-material/Search';
import { getCurrentStock, getStockHistory, adjustStock } from '../../services/rawMaterialStockService';

const RawMaterialStock = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rawMaterialId, setRawMaterialId] = useState('');
  const [currentStock, setCurrentStock] = useState(null);
  const [stockHistory, setStockHistory] = useState([]);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [adjustmentData, setAdjustmentData] = useState({ quantity: '', remarks: '' });

  const fetchCurrentStock = async () => {
    if (!rawMaterialId) return;
    try {
      setLoading(true);
      setError('');
      const stock = await getCurrentStock(rawMaterialId);
      setCurrentStock(stock);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch current stock');
    } finally {
      setLoading(false);
    }
  };

  const fetchStockHistory = async () => {
    if (!rawMaterialId) return;
    try {
      setLoading(true);
      setError('');
      const history = await getStockHistory(rawMaterialId, startDate, endDate);
      setStockHistory(history || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch stock history');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = async (e) => {
    e.preventDefault();
    if (!rawMaterialId) {
      setError('Please enter Raw Material ID');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await adjustStock(rawMaterialId, adjustmentData);
      setSuccess('Stock adjusted successfully!');
      fetchCurrentStock();
      fetchStockHistory();
      setAdjustmentData({ quantity: '', remarks: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to adjust stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InventoryIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">Raw Material Stock</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">View and manage raw material stock</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Raw Material ID" value={rawMaterialId} onChange={(e) => setRawMaterialId(e.target.value)} type="number" />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button fullWidth variant="contained" onClick={fetchCurrentStock} disabled={loading || !rawMaterialId} sx={{ height: '56px' }}>Get Current Stock</Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button fullWidth variant="outlined" onClick={fetchStockHistory} disabled={loading || !rawMaterialId} sx={{ height: '56px' }}>Get History</Button>
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

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>Adjust Stock</Typography>
            <form onSubmit={handleAdjustStock}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Quantity Adjustment" name="quantity" value={adjustmentData.quantity} onChange={(e) => setAdjustmentData({ ...adjustmentData, quantity: e.target.value })} type="number" required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Remarks" name="remarks" value={adjustmentData.remarks} onChange={(e) => setAdjustmentData({ ...adjustmentData, remarks: e.target.value })} />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : null}>Adjust Stock</Button>
                </Grid>
              </Grid>
            </form>
          </Grid>

          {stockHistory.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Stock History</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Opening Stock</TableCell>
                      <TableCell>Closing Stock</TableCell>
                      <TableCell>Quantity Added</TableCell>
                      <TableCell>Quantity Consumed</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stockHistory.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.stockDate}</TableCell>
                        <TableCell>{entry.openingStock}</TableCell>
                        <TableCell>{entry.closingStock}</TableCell>
                        <TableCell>{entry.quantityAdded}</TableCell>
                        <TableCell>{entry.quantityConsumed}</TableCell>
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

export default RawMaterialStock;


