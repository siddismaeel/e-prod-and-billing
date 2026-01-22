import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Divider,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import { upsertSalesOrder } from '../../services/salesOrderService';
import { getCustomersForDropdown } from '../../services/customerService';
import { getAllReadyItems } from '../../services/readyItemService';
import { getAllGoodsTypes } from '../../services/goodsTypeService';

const CreateSalesOrder = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dropdown data
  const [customers, setCustomers] = useState([]);
  const [readyItems, setReadyItems] = useState([]);
  const [goodsTypes, setGoodsTypes] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingReadyItems, setLoadingReadyItems] = useState(true);
  const [loadingGoodsTypes, setLoadingGoodsTypes] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    id: null,
    customerId: '',
    orderDate: new Date().toISOString().split('T')[0],
    totalAmount: 0,
    paidAmount: 0,
    balancePayment: 0,
    paymentStatus: 'PENDING',
    gst: 0,
    gstAmount: 0,
    remarks: '',
  });

  // Sales items state
  const [salesItems, setSalesItems] = useState([
    {
      id: null,
      salesOrderId: null,
      readyItemId: '',
      quality: '',
      goodsTypeId: '',
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
      rate: 0,
      report: 0,
      remarks: '',
    },
  ]);

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Payment status options
  const paymentStatusOptions = ['PENDING', 'PAID', 'PARTIAL', 'OVERDUE'];

  // Quality options
  const qualityOptions = ['M1', 'M2', 'M3'];

  // Fetch dropdown data on component mount
  useEffect(() => {
    fetchCustomers();
    fetchReadyItems();
    fetchGoodsTypes();
  }, []);

  // Calculate totalAmount when salesItems or GST changes
  useEffect(() => {
    const subtotal = salesItems.reduce((sum, item) => {
      return sum + (parseFloat(item.totalPrice) || 0);
    }, 0);
    
    const gstPercentage = parseFloat(formData.gst) || 0;
    const gstAmount = (subtotal * gstPercentage) / 100;
    const totalAmount = subtotal + gstAmount;
    
    setFormData((prev) => ({
      ...prev,
      gstAmount: gstAmount,
      totalAmount: totalAmount,
      balancePayment: totalAmount - (parseFloat(prev.paidAmount) || 0),
    }));
  }, [salesItems, formData.gst, formData.paidAmount]);

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

  // Fetch ready items
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

  // Fetch goods types
  const fetchGoodsTypes = async () => {
    try {
      setLoadingGoodsTypes(true);
      const data = await getAllGoodsTypes();
      setGoodsTypes(data || []);
    } catch (err) {
      console.warn('Goods types not available, will use ready item goodsTypeId');
      setGoodsTypes([]);
    } finally {
      setLoadingGoodsTypes(false);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Recalculate balancePayment if paidAmount changes
      if (name === 'paidAmount') {
        updated.balancePayment = (parseFloat(prev.totalAmount) || 0) - (parseFloat(value) || 0);
      }
      // GST change will trigger useEffect to recalculate totals
      return updated;
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    if (success) setSuccess('');
  };

  // Handle sales item field changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...salesItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Auto-calculate totalPrice when quantity or unitPrice changes
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const unitPrice = parseFloat(updatedItems[index].unitPrice) || 0;
      updatedItems[index].totalPrice = quantity * unitPrice;
    }

    // If ready item is selected, try to get goodsTypeId from ready item
    if (field === 'readyItemId' && value) {
      const readyItem = readyItems.find((ri) => ri.id === Number(value));
      if (readyItem && readyItem.goodsTypeId) {
        updatedItems[index].goodsTypeId = readyItem.goodsTypeId;
      }
    }

    setSalesItems(updatedItems);
  };

  // Add new sales item
  const handleAddItem = () => {
    setSalesItems([
      ...salesItems,
      {
        id: null,
        salesOrderId: null,
        readyItemId: '',
        quality: '',
        goodsTypeId: '',
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
        rate: 0,
        report: 0,
        remarks: '',
      },
    ]);
  };

  // Remove sales item
  const handleRemoveItem = (index) => {
    if (salesItems.length > 1) {
      const updatedItems = salesItems.filter((_, i) => i !== index);
      setSalesItems(updatedItems);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate main form fields
    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }
    if (!formData.orderDate) {
      newErrors.orderDate = 'Order date is required';
    }
    if (!formData.paymentStatus) {
      newErrors.paymentStatus = 'Payment status is required';
    }

    // Validate sales items
    if (salesItems.length === 0) {
      newErrors.salesItems = 'At least one sales item is required';
    }

    salesItems.forEach((item, index) => {
      if (!item.readyItemId) {
        newErrors[`item_${index}_readyItemId`] = 'Ready item is required';
      }
      if (!item.quality || !item.quality.trim()) {
        newErrors[`item_${index}_quality`] = 'Quality is required';
      }
      if (!item.goodsTypeId) {
        newErrors[`item_${index}_goodsTypeId`] = 'Goods type is required';
      }
      if (!item.quantity || item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
      }
      if (!item.unitPrice || item.unitPrice < 0) {
        newErrors[`item_${index}_unitPrice`] = 'Unit price is required';
      }
      if (!item.totalPrice || item.totalPrice < 0) {
        newErrors[`item_${index}_totalPrice`] = 'Total price is required';
      }
      if (item.rate === undefined || item.rate < 0) {
        newErrors[`item_${index}_rate`] = 'Rate is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        id: formData.id || 0,
        customerId: Number(formData.customerId),
        orderDate: formData.orderDate,
        totalAmount: parseFloat(formData.totalAmount) || 0,
        paidAmount: parseFloat(formData.paidAmount) || 0,
        balancePayment: parseFloat(formData.balancePayment) || 0,
        paymentStatus: formData.paymentStatus,
        gst: parseFloat(formData.gst) || 0,
        gstAmount: parseFloat(formData.gstAmount) || 0,
        remarks: formData.remarks || '',
        salesItems: salesItems.map((item) => ({
          id: item.id || 0,
          salesOrderId: item.salesOrderId || 0,
          readyItemId: Number(item.readyItemId),
          quality: item.quality.trim(),
          goodsTypeId: Number(item.goodsTypeId),
          quantity: parseFloat(item.quantity) || 0,
          unitPrice: parseFloat(item.unitPrice) || 0,
          totalPrice: parseFloat(item.totalPrice) || 0,
          rate: parseFloat(item.rate) || 0,
          report: parseFloat(item.report) || 0,
          remarks: item.remarks || '',
        })),
      };

      await upsertSalesOrder(payload);
      setSuccess('Sales order created successfully!');

      // Reset form after 2 seconds
      setTimeout(() => {
        handleReset();
      }, 2000);
    } catch (err) {
      console.error('Error creating sales order:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to create sales order. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      id: null,
      customerId: '',
      orderDate: new Date().toISOString().split('T')[0],
      totalAmount: 0,
      paidAmount: 0,
      balancePayment: 0,
      paymentStatus: 'PENDING',
      gst: 0,
      gstAmount: 0,
      remarks: '',
    });
    setSalesItems([
      {
        id: null,
        salesOrderId: null,
        readyItemId: '',
        quality: '',
        goodsTypeId: '',
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
        rate: 0,
        report: 0,
        remarks: '',
      },
    ]);
    setErrors({});
    setError('');
    setSuccess('');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PointOfSaleIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Create Sales Order
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Create a new sales order by filling in the details below
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Order Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
                Order Information
              </Typography>
            </Grid>

            {/* Customer */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.customerId} disabled={loading || loadingCustomers}>
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
                {errors.customerId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.customerId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Order Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Order Date"
                name="orderDate"
                type="date"
                value={formData.orderDate}
                onChange={handleChange}
                error={!!errors.orderDate}
                helperText={errors.orderDate}
                required
                disabled={loading}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Payment Information Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
                Payment Information
              </Typography>
            </Grid>

            {/* Payment Status */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth required error={!!errors.paymentStatus} disabled={loading}>
                <InputLabel id="payment-status-label">Payment Status</InputLabel>
                <Select
                  labelId="payment-status-label"
                  id="payment-status"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  label="Payment Status"
                  onChange={handleChange}
                >
                  {paymentStatusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
                {errors.paymentStatus && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.paymentStatus}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* GST Percentage */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="GST (%)"
                name="gst"
                type="number"
                value={formData.gst}
                onChange={handleChange}
                disabled={loading}
                inputProps={{ min: 0, max: 100, step: 0.01 }}
                helperText="GST percentage (default: 0)"
              />
            </Grid>

            {/* GST Amount */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="GST Amount"
                value={formData.gstAmount.toFixed(2)}
                disabled
                InputProps={{ readOnly: true }}
              />
            </Grid>

            {/* Total Amount */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth label="Total Amount" value={formData.totalAmount.toFixed(2)} disabled InputProps={{ readOnly: true }}
              />
            </Grid>

            {/* Paid Amount */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Paid Amount"
                name="paidAmount"
                type="number"
                value={formData.paidAmount}
                onChange={handleChange}
                disabled={loading}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            {/* Balance Payment */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Balance Payment"
                value={formData.balancePayment.toFixed(2)}
                disabled
                InputProps={{ readOnly: true }}
              />
            </Grid>

            {/* Remarks */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                multiline
                rows={3}
                disabled={loading}
                placeholder="Enter any additional remarks"
              />
            </Grid>

            {/* Sales Items Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 2, sm: 0 },
                }}
              >
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  Sales Items
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddItem}
                  disabled={loading}
                  size={isMobile ? 'medium' : 'small'}
                  fullWidth={isMobile}
                >
                  Add Item
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              {isMobile ? (
                // Mobile Card Layout
                <Box>
                  {salesItems.map((item, index) => (
                    <Card key={index} sx={{ mb: 2, boxShadow: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" sx={{ color: 'primary.main' }}>
                            Item {index + 1}
                          </Typography>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveItem(index)}
                            disabled={loading || salesItems.length === 1}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <Grid container spacing={2}>
                          {/* Ready Item */}
                          <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors[`item_${index}_readyItemId`]} disabled={loading || loadingReadyItems}>
                              <InputLabel>Ready Item</InputLabel>
                              <Select
                                value={item.readyItemId}
                                onChange={(e) => handleItemChange(index, 'readyItemId', e.target.value)}
                                label="Ready Item"
                                displayEmpty
                              >
                                <MenuItem value="">
                                  <em>Select Ready Item</em>
                                </MenuItem>
                                {readyItems.map((ri) => (
                                  <MenuItem key={ri.id} value={ri.id}>
                                    {ri.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            {errors[`item_${index}_readyItemId`] && (
                              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                {errors[`item_${index}_readyItemId`]}
                              </Typography>
                            )}
                          </Grid>

                          {/* Quality */}
                          <Grid item xs={12}>
                            <FormControl fullWidth required error={!!errors[`item_${index}_quality`]} disabled={loading}>
                              <InputLabel id={`quality-select-label-${index}`}>Quality</InputLabel>
                              <Select
                                labelId={`quality-select-label-${index}`}
                                id={`quality-select-${index}`}
                                value={item.quality}
                                label="Quality"
                                onChange={(e) => handleItemChange(index, 'quality', e.target.value)}
                              >
                                {qualityOptions.map((quality) => (
                                  <MenuItem key={quality} value={quality}>
                                    {quality}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors[`item_${index}_quality`] && (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                  {errors[`item_${index}_quality`]}
                                </Typography>
                              )}
                            </FormControl>
                          </Grid>

                          {/* Goods Type */}
                          <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors[`item_${index}_goodsTypeId`]} disabled={loading || loadingGoodsTypes || !item.readyItemId}>
                              <InputLabel>Goods Type</InputLabel>
                              <Select
                                value={item.goodsTypeId}
                                onChange={(e) => handleItemChange(index, 'goodsTypeId', e.target.value)}
                                label="Goods Type"
                                displayEmpty
                              >
                                <MenuItem value="">
                                  <em>Select Goods Type</em>
                                </MenuItem>
                                {goodsTypes.length > 0 ? (
                                  goodsTypes.map((gt) => (
                                    <MenuItem key={gt.id} value={gt.id}>
                                      {gt.name}
                                    </MenuItem>
                                  ))
                                ) : (
                                  <MenuItem value={item.goodsTypeId || ''} disabled>
                                    {item.goodsTypeId ? `Type ${item.goodsTypeId}` : 'Auto from Ready Item'}
                                  </MenuItem>
                                )}
                              </Select>
                            </FormControl>
                            {errors[`item_${index}_goodsTypeId`] && (
                              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                {errors[`item_${index}_goodsTypeId`]}
                              </Typography>
                            )}
                          </Grid>

                          {/* Quantity & Unit Price */}
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Quantity"
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              error={!!errors[`item_${index}_quantity`]}
                              helperText={errors[`item_${index}_quantity`]}
                              disabled={loading}
                              inputProps={{ min: 0, step: 0.01 }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Unit Price"
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                              error={!!errors[`item_${index}_unitPrice`]}
                              helperText={errors[`item_${index}_unitPrice`]}
                              disabled={loading}
                              inputProps={{ min: 0, step: 0.01 }}
                            />
                          </Grid>

                          {/* Total Price */}
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Total Price"
                              type="number"
                              value={item.totalPrice}
                              onChange={(e) => handleItemChange(index, 'totalPrice', e.target.value)}
                              error={!!errors[`item_${index}_totalPrice`]}
                              helperText={errors[`item_${index}_totalPrice`]}
                              disabled={loading}
                              inputProps={{ min: 0, step: 0.01 }}
                            />
                          </Grid>

                          {/* Rate */}
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Rate"
                              type="number"
                              value={item.rate}
                              onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                              error={!!errors[`item_${index}_rate`]}
                              helperText={errors[`item_${index}_rate`]}
                              disabled={loading}
                              inputProps={{ min: 0, step: 0.01 }}
                            />
                          </Grid>

                          {/* Remarks */}
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Remarks"
                              value={item.remarks}
                              onChange={(e) => handleItemChange(index, 'remarks', e.target.value)}
                              disabled={loading}
                              multiline
                              rows={2}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                  {errors.salesItems && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.salesItems}
                    </Typography>
                  )}
                </Box>
              ) : (
                // Desktop Table Layout
                <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'primary.main' }}>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ready Item</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quality</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Goods Type</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Unit Price</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total Price</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rate</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Remarks</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {salesItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <FormControl fullWidth size="small" error={!!errors[`item_${index}_readyItemId`]}>
                              <Select
                                value={item.readyItemId}
                                onChange={(e) => handleItemChange(index, 'readyItemId', e.target.value)}
                                disabled={loading || loadingReadyItems}
                                displayEmpty
                              >
                                <MenuItem value="">
                                  <em>Select</em>
                                </MenuItem>
                                {readyItems.map((ri) => (
                                  <MenuItem key={ri.id} value={ri.id}>
                                    {ri.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <FormControl fullWidth size="small" error={!!errors[`item_${index}_quality`]} disabled={loading}>
                              <Select
                                value={item.quality}
                                onChange={(e) => handleItemChange(index, 'quality', e.target.value)}
                                displayEmpty
                                sx={{ width: 120 }}
                              >
                                <MenuItem value="">
                                  <em>Select</em>
                                </MenuItem>
                                {qualityOptions.map((quality) => (
                                  <MenuItem key={quality} value={quality}>
                                    {quality}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <FormControl fullWidth size="small" error={!!errors[`item_${index}_goodsTypeId`]}>
                              <Select
                                value={item.goodsTypeId}
                                onChange={(e) => handleItemChange(index, 'goodsTypeId', e.target.value)}
                                disabled={loading || loadingGoodsTypes || !item.readyItemId}
                                displayEmpty
                              >
                                <MenuItem value="">
                                  <em>Select</em>
                                </MenuItem>
                                {goodsTypes.length > 0 ? (
                                  goodsTypes.map((gt) => (
                                    <MenuItem key={gt.id} value={gt.id}>
                                      {gt.name}
                                    </MenuItem>
                                  ))
                                ) : (
                                  <MenuItem value={item.goodsTypeId || ''} disabled>
                                    {item.goodsTypeId ? `Type ${item.goodsTypeId}` : 'Auto from Ready Item'}
                                  </MenuItem>
                                )}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              error={!!errors[`item_${index}_quantity`]}
                              disabled={loading}
                              inputProps={{ min: 0, step: 0.01 }}
                              sx={{ width: 100 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                              error={!!errors[`item_${index}_unitPrice`]}
                              disabled={loading}
                              inputProps={{ min: 0, step: 0.01 }}
                              sx={{ width: 100 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={item.totalPrice}
                              onChange={(e) => handleItemChange(index, 'totalPrice', e.target.value)}
                              error={!!errors[`item_${index}_totalPrice`]}
                              disabled={loading}
                              inputProps={{ min: 0, step: 0.01 }}
                              sx={{ width: 100 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={item.rate}
                              onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                              error={!!errors[`item_${index}_rate`]}
                              disabled={loading}
                              inputProps={{ min: 0, step: 0.01 }}
                              sx={{ width: 80 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={item.remarks}
                              onChange={(e) => handleItemChange(index, 'remarks', e.target.value)}
                              disabled={loading}
                              sx={{ width: 120 }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveItem(index)}
                              disabled={loading || salesItems.length === 1}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {errors.salesItems && !isMobile && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                  {errors.salesItems}
                </Typography>
              )}
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'flex-end',
                  mt: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ClearIcon />}
                  onClick={handleReset}
                  disabled={loading}
                  fullWidth={isMobile}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                  fullWidth={isMobile}
                >
                  {loading ? 'Creating...' : 'Create Sales Order'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateSalesOrder;
