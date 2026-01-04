import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Alert, TextField, Button, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ListIcon from '@mui/icons-material/List';
import { getCashFlow } from '../../services/cashflowService';

const ListCashflow = () => {
  const [cashflow, setCashflow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchCashflow = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCashFlow(startDate, endDate);
      setCashflow(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch cashflow');
      setCashflow([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCashflow();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'date', headerName: 'Date', flex: 1, minWidth: 150 },
    { field: 'amount', headerName: 'Amount', flex: 1, minWidth: 120 },
    { field: 'type', headerName: 'Type', flex: 1, minWidth: 120 },
    { field: 'description', headerName: 'Description', flex: 1, minWidth: 200 },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccountBalanceIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <ListIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">Cashflow</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">View cashflow entries</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button fullWidth variant="contained" onClick={fetchCashflow} disabled={loading} sx={{ height: '56px' }}>Fetch Cashflow</Button>
          </Grid>
        </Grid>
        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box> : cashflow.length === 0 ? <Box sx={{ p: 4, textAlign: 'center' }}><Typography variant="body1" color="text.secondary">No cashflow entries found</Typography></Box> : <Box sx={{ height: 600, width: '100%' }}><DataGrid rows={cashflow} columns={columns} getRowId={(row) => row.id} pageSize={10} rowsPerPageOptions={[10, 25, 50]} disableSelectionOnClick sx={{ '& .MuiDataGrid-cell:focus': { outline: 'none' } }} /></Box>}
      </Paper>
    </Container>
  );
};

export default ListCashflow;


