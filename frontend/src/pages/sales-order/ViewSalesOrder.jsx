import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Alert,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getSalesOrderById } from '../../services/salesOrderService';

const ViewSalesOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [salesOrder, setSalesOrder] = useState(null);

  useEffect(() => {
    if (id) {
      fetchSalesOrder();
    }
  }, [id]);

  const fetchSalesOrder = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getSalesOrderById(Number(id));
      setSalesOrder(data);
    } catch (err) {
      console.error('Error fetching sales order:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch sales order');
      setSalesOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return '₹0.00';
    return `₹${Number(value).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (err) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !salesOrder) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/sales-orders/list')}
            sx={{ mb: 2 }}
          >
            Back to List
          </Button>
        </Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Sales order not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ReceiptIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            View Sales Order
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Sales Order #{salesOrder.id}
        </Typography>
      </Box>

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/sales-orders/list')}
        sx={{ mb: 3 }}
      >
        Back to List
      </Button>

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {/* Order Information Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
              Order Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Order ID
                </Typography>
                <Typography variant="h6">{salesOrder.id || '-'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Customer Name
                </Typography>
                <Typography variant="h6">{salesOrder.customerName || '-'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Order Date
                </Typography>
                <Typography variant="h6">{formatDate(salesOrder.orderDate)}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Payment Information Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
              Payment Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Payment Status
                </Typography>
                <Typography variant="h6">{salesOrder.paymentStatus || '-'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Amount
                </Typography>
                <Typography variant="h6">{formatCurrency(salesOrder.totalAmount)}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Paid Amount
                </Typography>
                <Typography variant="h6">{formatCurrency(salesOrder.paidAmount)}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Balance Payment
                </Typography>
                <Typography variant="h6">{formatCurrency(salesOrder.balancePayment)}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* GST Information Section */}
          {salesOrder.gst !== undefined && salesOrder.gstAmount !== undefined && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
                  GST Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      GST (%)
                    </Typography>
                    <Typography variant="h6">{Number(salesOrder.gst || 0).toFixed(2)}%</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      GST Amount
                    </Typography>
                    <Typography variant="h6">{formatCurrency(salesOrder.gstAmount)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}

          {/* Remarks Section */}
          {salesOrder.remarks && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
                  Remarks
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body1">{salesOrder.remarks || '-'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}

          {/* Sales Items Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
              Sales Items
            </Typography>
          </Grid>

          <Grid item xs={12}>
            {salesOrder.salesItems && salesOrder.salesItems.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table>
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salesOrder.salesItems.map((item, index) => (
                      <TableRow key={item.id || index}>
                        <TableCell>{item.readyItemName || `Item ${item.readyItemId || index + 1}`}</TableCell>
                        <TableCell>{item.quality || '-'}</TableCell>
                        <TableCell>{item.goodsTypeName || `Type ${item.goodsTypeId || '-'}`}</TableCell>
                        <TableCell>{Number(item.quantity || 0).toFixed(2)}</TableCell>
                        <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell>{formatCurrency(item.totalPrice)}</TableCell>
                        <TableCell>{formatCurrency(item.rate)}</TableCell>
                        <TableCell>{item.remarks || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">No sales items found for this order.</Alert>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ViewSalesOrder;
