import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Grid, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { recordPayment } from '../../services/paymentService';
import { getCustomersForDropdown } from '../../services/customerService';
import { getAllSalesOrders } from '../../services/salesOrderService';
import { getAllPurchaseOrders } from '../../services/purchaseOrderService';

const CreatePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ customerId: '', orderId: '', orderType: 'SALES', amount: '', paymentDate: new Date().toISOString().split('T')[0], paymentMode: '', remarks: '' });

  // Dropdown data
  const [customers, setCustomers] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingSalesOrders, setLoadingSalesOrders] = useState(true);
  const [loadingPurchaseOrders, setLoadingPurchaseOrders] = useState(true);

  // Payment method options
  const paymentMethodOptions = ['CASH', 'CHEQUE', 'BANK_TRANSFER', 'OTHER'];

  // Fetch dropdown data on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch orders when customer is selected
  useEffect(() => {
    if (formData.customerId) {
      fetchSalesOrdersForCustomer(Number(formData.customerId));
      fetchPurchaseOrdersForCustomer(Number(formData.customerId));
    } else {
      // Clear orders when no customer is selected
      setSalesOrders([]);
      setPurchaseOrders([]);
    }
  }, [formData.customerId]);

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

  // Fetch sales orders for specific customer
  const fetchSalesOrdersForCustomer = async (customerId) => {
    try {
      setLoadingSalesOrders(true);
      const allOrders = await getAllSalesOrders();
      // Filter orders by customer ID
      const customerOrders = allOrders.filter(order => order.customerId === customerId);
      setSalesOrders(customerOrders || []);
    } catch (err) {
      console.error('Error fetching sales orders:', err);
      setError('Failed to load sales orders. Please refresh the page.');
    } finally {
      setLoadingSalesOrders(false);
    }
  };

  // Fetch purchase orders for specific customer
  const fetchPurchaseOrdersForCustomer = async (customerId) => {
    try {
      setLoadingPurchaseOrders(true);
      const allOrders = await getAllPurchaseOrders();
      // Filter orders by customer ID
      const customerOrders = allOrders.filter(order => order.customerId === customerId);
      setPurchaseOrders(customerOrders || []);
    } catch (err) {
      console.error('Error fetching purchase orders:', err);
      setError('Failed to load purchase orders. Please refresh the page.');
    } finally {
      setLoadingPurchaseOrders(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If orderType or customerId changes, clear orderId
    if (name === 'orderType' || name === 'customerId') {
      setFormData((prev) => ({ ...prev, [name]: value, orderId: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Prepare payload with proper field mapping
      const payload = {
        customerId: formData.customerId ? Number(formData.customerId) : null,
        transactionType: formData.orderType === 'SALES' ? 'SALES_PAYMENT' : 'PURCHASE_PAYMENT',
        amount: formData.amount ? Number(formData.amount) : null,
        transactionDate: formData.paymentDate,
        paymentMode: formData.paymentMode || null,
        remarks: formData.remarks || null,
      };
      
      // Map orderId to salesOrderId or purchaseOrderId based on orderType
      if (formData.orderId) {
        if (formData.orderType === 'SALES') {
          payload.salesOrderId = Number(formData.orderId);
        } else {
          payload.purchaseOrderId = Number(formData.orderId);
        }
      }
      
      await recordPayment(payload);
      setSuccess('Payment recorded successfully!');
      setTimeout(() => setFormData({ customerId: '', orderId: '', orderType: 'SALES', amount: '', paymentDate: new Date().toISOString().split('T')[0], paymentMode: '', remarks: '' }), 2000);
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
              <FormControl fullWidth required error={!!error && !formData.customerId} disabled={loading || loadingCustomers}>
                <InputLabel id="customer-select-label">Customer</InputLabel>
                <Select
                  labelId="customer-select-label"
                  id="customer-select"
                  name="customerId"
                  value={formData.customerId}
                  label="Customer"
                  onChange={handleChange}
                >
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!error && !formData.orderId} disabled={loading}>
                <InputLabel id="order-type-select-label">Order Type</InputLabel>
                <Select
                  labelId="order-type-select-label"
                  id="order-type-select"
                  name="orderType"
                  value={formData.orderType}
                  label="Order Type"
                  onChange={handleChange}
                >
                  <MenuItem value="SALES">SALES</MenuItem>
                  <MenuItem value="PURCHASE">PURCHASE</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!error && !formData.orderId} disabled={loading || !formData.customerId || (formData.orderType === 'SALES' ? loadingSalesOrders : loadingPurchaseOrders)}>
                <InputLabel id="order-select-label">Order (Optional)</InputLabel>
                <Select
                  labelId="order-select-label"
                  id="order-select"
                  name="orderId"
                  value={formData.orderId}
                  label="Order (Optional)"
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>None (General Payment)</em>
                  </MenuItem>
                  {formData.orderType === 'SALES' ? (
                    loadingSalesOrders ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading sales orders...
                      </MenuItem>
                    ) : salesOrders.length === 0 ? (
                      <MenuItem disabled>No sales orders available</MenuItem>
                    ) : (
                      salesOrders.map((order) => (
                        <MenuItem key={order.id} value={order.id}>
                          Order #{order.id} - {order.orderDate} - ₹{order.totalAmount?.toFixed(2) || '0.00'}
                        </MenuItem>
                      ))
                    )
                  ) : (
                    loadingPurchaseOrders ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading purchase orders...
                      </MenuItem>
                    ) : purchaseOrders.length === 0 ? (
                      <MenuItem disabled>No purchase orders available</MenuItem>
                    ) : (
                      purchaseOrders.map((order) => (
                        <MenuItem key={order.id} value={order.id}>
                          Order #{order.id} - {order.orderDate} - ₹{order.totalAmount?.toFixed(2) || '0.00'}
                        </MenuItem>
                      ))
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Amount" name="amount" value={formData.amount} onChange={handleChange} disabled={loading} type="number" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Payment Date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} disabled={loading} type="date" InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!error && !formData.paymentMode} disabled={loading}>
                <InputLabel id="payment-mode-select-label">Payment Method</InputLabel>
                <Select
                  labelId="payment-mode-select-label"
                  id="payment-mode-select"
                  name="paymentMode"
                  value={formData.paymentMode}
                  label="Payment Method"
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Payment Method</em>
                  </MenuItem>
                  {paymentMethodOptions.map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Remarks" name="remarks" value={formData.remarks} onChange={handleChange} disabled={loading} multiline rows={3} />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" startIcon={<ClearIcon />} onClick={() => setFormData({ customerId: '', orderId: '', orderType: 'SALES', amount: '', paymentDate: new Date().toISOString().split('T')[0], paymentMode: '', remarks: '' })} disabled={loading} size="large">Clear</Button>
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

