import React from 'react';
import { Box, Typography, Button, Grid, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ProductCard from '../components/ProductCard/ProductCard';
import { products } from '../data/products'; // Get products directly

// Get top 4 rated products
const topRatedProducts = [...products]
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 4);

// Get 4 "latest" products (just slicing for this demo)
const latestProducts = [...products].slice(0, 4);

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          height: '60vh',
          backgroundImage: 'url(https://placehold.co/1200x600/333/fff?text=Welcome+to+ElectroShop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          p: 3,
          mb: 6,
          borderRadius: 2,
        }}
      >
        <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
          Home Appliance ElectroMart
        </Typography>
        <Typography variant="h5" sx={{ mb: 5 }}>
          
          {/* Find the best electronics and home appliances */}
        </Typography>
        <Button
          component={RouterLink}
          to="/shop"
          variant="contained"
          color="primary"
          size="large"
        >
          Shop Now
        </Button>
      </Box>

      {/* Top Rated Products Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
          Top Rated Products
        </Typography>
        <Grid container spacing={3}>
          {topRatedProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Latest Products Section */}
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
          Latest Arrivals
        </Typography>
        <Grid container spacing={3}>
          {latestProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;