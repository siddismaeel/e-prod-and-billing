import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Grid, Alert, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getCurrentStock, getStockHistory, getAllCurrentStocks } from '../../services/readyItemStockService';
import { getAllReadyItems } from '../../services/readyItemService';

const ReadyItemStock = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [readyItemId, setReadyItemId] = useState('');
  const [currentStock, setCurrentStock] = useState(null);
  const [stockHistory, setStockHistory] = useState([]);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Dropdown data
  const [readyItems, setReadyItems] = useState([]);
  const [loadingReadyItems, setLoadingReadyItems] = useState(true);
  
  // All stocks data
  const [allStocks, setAllStocks] = useState([]);
  const [loadingAllStocks, setLoadingAllStocks] = useState(true);

  // Fetch ready items and all stocks on component mount
  useEffect(() => {
    fetchReadyItems();
    fetchAllStocks();
  }, []);

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

  const fetchAllStocks = async () => {
    try {
      setLoadingAllStocks(true);
      const data = await getAllCurrentStocks();
      setAllStocks(data || []);
    } catch (err) {
      console.error('Error fetching all stocks:', err);
      setError('Failed to load all stocks. Please refresh the page.');
    } finally {
      setLoadingAllStocks(false);
    }
  };

  const fetchCurrentStock = async () => {
    if (!readyItemId) return;
    try {
      setLoading(true);
      setError('');
      const stock = await getCurrentStock(Number(readyItemId));
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
      const history = await getStockHistory(Number(readyItemId), startDate, endDate);
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

      {/* All Stocks Section */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
          All Ready Item Stocks
        </Typography>
        
        {loadingAllStocks ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : allStocks.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No stock data available
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ height: 400, width: '100%', mb: 3 }}>
              <DataGrid
                rows={allStocks}
                columns={[
                  {
                    field: 'readyItemId',
                    headerName: 'Ready Item ID',
                    flex: 1,
                    minWidth: 150,
                    sortable: true,
                  },
                  {
                    field: 'readyItemName',
                    headerName: 'Ready Item Name',
                    flex: 1,
                    minWidth: 200,
                    sortable: true,
                  },
                  {
                    field: 'currentStock',
                    headerName: 'Current Stock',
                    flex: 1,
                    minWidth: 200,
                    sortable: true,
                    valueGetter: (value, row) => {
                      const stock = Number(row.currentStock || 0);
                      return stock;
                    },
                    renderCell: (params) => {
                      const stock = Number(params.row.currentStock || 0).toFixed(2);
                      const unit = params.row.unit || '';
                      return `${stock} ${unit}`.trim();
                    },
                  },
                ]}
                getRowId={(row) => row.readyItemId}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                sx={{
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'primary.main',
                    color: '#ffffff',
                    fontWeight: 'bold',
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    color: '#ffffff',
                    fontWeight: 'bold',
                  },
                  '& .MuiDataGrid-columnHeader': {
                    color: '#ffffff',
                  },
                  '& .MuiDataGrid-sortIcon': {
                    color: '#ffffff',
                  },
                  '& .MuiDataGrid-menuIcon': {
                    color: '#ffffff',
                  },
                  '& .MuiDataGrid-filterIcon': {
                    color: '#ffffff',
                  },
                  '& .MuiDataGrid-columnHeader:focus': {
                    outline: 'none',
                  },
                }}
              />
            </Box>
            
            {/* Total Summary */}
            {allStocks.length > 0 && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 1 }}>
                <Typography variant="h6">
                  Total Stock: {allStocks.reduce((sum, stock) => sum + Number(stock.currentStock || 0), 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
                  Total Quantity of All Items: {allStocks.reduce((sum, stock) => sum + Number(stock.currentStock || 0), 0).toFixed(2)}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Single Item View Section */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
          View Stock for Specific Item
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth disabled={loadingReadyItems}>
              <InputLabel id="ready-item-select-label">Ready Item</InputLabel>
              <Select
                labelId="ready-item-select-label"
                id="ready-item-select"
                value={readyItemId}
                label="Ready Item"
                onChange={(e) => setReadyItemId(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Select Ready Item</em>
                </MenuItem>
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
                      {item.name || `Ready Item ${item.id}`}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
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



