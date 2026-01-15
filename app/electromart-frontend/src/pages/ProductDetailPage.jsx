import React, { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  Typography,
  Button,
  Rating,
  Chip,
  Breadcrumbs,
  Link,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { products } from '../data/products'; // Import the raw product data
import { addItem } from '../features/cart/cartSlice';
import QuantitySelector from '../components/QuantitySelector/QuantitySelector';
import MessageDialog from '../components/MessageDialog/MessageDialog';
import { formatPrice } from '../utils/helpers';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = products.find((p) => p.id === id);

  const [quantity, setQuantity] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Find this item in the cart to check against stock
  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item.id === id)
  );
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const availableStock = product.stock - quantityInCart;

  if (!product) {
    return (
      <Typography variant="h4" align="center">
        Product not found
      </Typography>
    );
  }

  const handleAddToCart = () => {
    // Dispatch the addItem action
    dispatch(
      addItem({
        ...product,
        quantity: quantity,
      })
    );
    // Show confirmation dialog
    setDialogOpen(true);
    // Reset quantity to 1
    setQuantity(1);
  };

  const isOutOfStock = product.stock === 0;
  const canAddToCart = !isOutOfStock && availableStock > 0;

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/">
          Home
        </Link>
        <Link component={RouterLink} underline="hover" color="inherit" to="/shop">
          Shop
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={product.imageUrl}
            alt={product.name}
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 2,
              border: '1px solid #eee'
            }}
          />
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating} precision={0.1} readOnly />
            <Typography sx={{ ml: 1 }}>({product.rating})</Typography>
          </Box>
          
          <Typography variant="h4" color="primary.main" fontWeight="500" sx={{ mb: 2 }}>
            {formatPrice(product.price)}
          </Typography>
          
          <Chip
            label={isOutOfStock ? 'Out of Stock' : 'In Stock'}
            color={isOutOfStock ? 'error' : 'success'}
            sx={{ mb: 2 }}
          />

          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          {!isOutOfStock && (
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="h6">Quantity:</Typography>
              <QuantitySelector
                quantity={quantity}
                setQuantity={setQuantity}
                maxQuantity={availableStock}
              />
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={!canAddToCart}
          >
            {isOutOfStock ? 'Out of Stock' : (availableStock > 0 ? 'Add to Cart' : 'Max in Cart')}
          </Button>
           {!canAddToCart && !isOutOfStock && (
             <Typography color="error" sx={{mt: 1}}>You've already added the max available stock to your cart.</Typography>
           )}
        </Grid>
      </Grid>
      
      <MessageDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        title="Added to Cart!"
        message={`${product.name} has been added to your cart.`}
      />
    </Box>
  );
};

export default ProductDetailPage;