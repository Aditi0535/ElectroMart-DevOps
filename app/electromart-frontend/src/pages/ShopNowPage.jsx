import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Box, Typography, TextField, Paper } from '@mui/material';
import ProductCard from '../components/ProductCard/ProductCard';
import CategoryFilter from '../components/CategoryFilter/CategoryFilter';
import SortDropdown from '../components/SortDropdown/SortDropdown';
import { selectFilteredAndSortedProducts } from '../features/products/productSelectors';
import { setSearchQuery } from "../features/products/productSlice";

const ShopNowPage = () => {
  const dispatch = useDispatch();
  // Get the final list of products from the memoized selector
  const filteredProducts = useSelector(selectFilteredAndSortedProducts);
  const searchQuery = useSelector((state) => state.products.searchQuery);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <Grid container spacing={4}>
      {/* Filters Column */}
      <Grid item xs={12} md={3}>
        <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <CategoryFilter />
        </Paper>
      </Grid>

      {/* Products Column */}
      <Grid item xs={12} md={9}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <TextField
            label="Search Products"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ minWidth: '250px' }}
          />
          <SortDropdown />
        </Box>

        {filteredProducts.length > 0 ? (
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
            No products found matching your criteria.
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default ShopNowPage;