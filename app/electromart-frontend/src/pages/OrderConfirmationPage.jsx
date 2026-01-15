import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Paper, Divider } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { selectCurrentOrder } from '../features/order/orderSlice';
import { formatPrice } from '../utils/helpers';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  // Get the final order details from the Redux state
  const order = useSelector(selectCurrentOrder);

  // If there's no order in the state (e.g., user refreshed the page or
  // navigated here directly), redirect them to the home page.
  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  // If order is null, return null to prevent rendering before redirect
  if (!order) {
    return null;
  }

  // The order object now contains the _id and createdAt from the database!
  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', textAlign: 'center' }}>
      <Paper sx={{ p: 4 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main' }} />
        <Typography variant="h3" component="h1" gutterBottom sx={{ mt: 2 }}>
          Thank You For Your Order!
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Your order has been placed successfully.
        </Typography>
        
        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'left', mb: 3 }}>
          <Typography variant="h5" gutterBottom>Order Summary</Typography>
          <Typography>
            <strong>Order ID:</strong> {order._id}
          </Typography>
          <Typography>
            <strong>Name:</strong> {order.customer.name}
          </Typography>
          <Typography>
            <strong>Email:</strong> {order.customer.email}
          </Typography>
          <Typography>
            <strong>Shipping Address:</strong> {order.customer.address}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            <strong>Total Paid: {formatPrice(order.total)}</strong>
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>Items Ordered</Typography>
        <Box sx={{ textAlign: 'left' }}>
          {order.items.map(item => (
            <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1}}>
              <Typography>{item.name} (x{item.quantity})</Typography>
              <Typography>{formatPrice(item.price * item.quantity)}</Typography>
            </Box>
          ))}
        </Box>

        <Button
          component={RouterLink}
          to="/shop"
          variant="contained"
          size="large"
          sx={{ mt: 4 }}
        >
          Continue Shopping
        </Button>
      </Paper>
    </Box>
  );
};

export default OrderConfirmationPage;