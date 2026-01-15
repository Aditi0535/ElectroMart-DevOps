import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';

const ProductCard = ({ product }) => {
  const isOutOfStock = product.stock === 0;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.imageUrl}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.category}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.rating} precision={0.1} readOnly size="small" />
          <Typography sx={{ ml: 0.5 }}>({product.rating})</Typography>
        </Box>
        <Typography variant="h5" color="text.primary" sx={{ mb: 1 }}>
          {formatPrice(product.price)}
        </Typography>
        {isOutOfStock && (
          <Chip label="Out of Stock" color="error" size="small" />
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          component={RouterLink}
          to={`/product/${product.id}`}
          size="small"
          variant="contained"
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;