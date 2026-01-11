import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Grid, Alert, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import InventoryIcon from '@mui/icons-material/Inventory';
import SearchIcon from '@mui/icons-material/Search';
import { getCurrentStock, getStockHistory, adjustStock, getAllCurrentStocks } from '../../services/rawMaterialStockService';
import { getAllRawMaterials } from '../../services/rawMaterialService';

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
  
  // Dropdown data
  const [rawMaterials, setRawMaterials] = useState([]);
  const [loadingRawMaterials, setLoadingRawMaterials] = useState(true);
  
  // All stocks data
  const [allStocks, setAllStocks] = useState([]);
  const [loadingAllStocks, setLoadingAllStocks] = useState(true);

  // Fetch raw materials and all stocks on component mount
  useEffect(() => {
    fetchRawMaterials();
    fetchAllStocks();
  }, []);

  const fetchRawMaterials = async () => {
    try {
      setLoadingRawMaterials(true);
      const data = await getAllRawMaterials();
      setRawMaterials(data || []);
    } catch (err) {
      console.error('Error fetching raw materials:', err);
      setError('Failed to load raw materials. Please refresh the page.');
    } finally {
      setLoadingRawMaterials(false);
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
    if (!rawMaterialId) return;
    try {
      setLoading(true);
      setError('');
      const stock = await getCurrentStock(Number(rawMaterialId));
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
      const history = await getStockHistory(Number(rawMaterialId), startDate, endDate);
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
      setError('Please select a Raw Material');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await adjustStock(Number(rawMaterialId), adjustmentData);
      setSuccess('Stock adjusted successfully!');
      fetchCurrentStock();
      fetchStockHistory();
      fetchAllStocks(); // Refresh all stocks after adjustment
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

      {/* All Stocks Section */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
          All Raw Material Stocks
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
                    field: 'rawMaterialId',
                    headerName: 'Raw Material ID',
                    flex: 1,
                    minWidth: 150,
                    sortable: true,
                  },
                  {
                    field: 'rawMaterialName',
                    headerName: 'Raw Material Name',
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
                getRowId={(row) => row.rawMaterialId}
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
                  Total Quantity of All Materials: {allStocks.reduce((sum, stock) => sum + Number(stock.currentStock || 0), 0).toFixed(2)}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Single Material View Section */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
          View/Adjust Stock for Specific Material
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth disabled={loadingRawMaterials}>
              <InputLabel id="raw-material-select-label">Raw Material</InputLabel>
              <Select
                labelId="raw-material-select-label"
                id="raw-material-select"
                value={rawMaterialId}
                label="Raw Material"
                onChange={(e) => setRawMaterialId(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Select Raw Material</em>
                </MenuItem>
                {loadingRawMaterials ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Loading raw materials...
                  </MenuItem>
                ) : rawMaterials.length === 0 ? (
                  <MenuItem disabled>No raw materials available</MenuItem>
                ) : (
                  rawMaterials.map((rm) => (
                    <MenuItem key={rm.id} value={rm.id}>
                      {rm.name || `Raw Material ${rm.id}`}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
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



