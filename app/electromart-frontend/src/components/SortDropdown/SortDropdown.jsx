import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { setSortOrder } from '../../features/products/productSlice';

const SortDropdown = () => {
  const dispatch = useDispatch();
  const sortOrder = useSelector((state) => state.products.sortOrder);

  const handleChange = (event) => {
    dispatch(setSortOrder(event.target.value));
  };

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel id="sort-by-label">Sort By</InputLabel>
      <Select
        labelId="sort-by-label"
        id="sort-by-select"
        value={sortOrder}
        label="Sort By"
        onChange={handleChange}
      >
        <MenuItem value="default">Default</MenuItem>
        <MenuItem value="price_asc">Price: Low to High</MenuItem>
        <MenuItem value="price_desc">Price: High to Low</MenuItem>
        <MenuItem value="rating_desc">Rating: High to Low</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SortDropdown;