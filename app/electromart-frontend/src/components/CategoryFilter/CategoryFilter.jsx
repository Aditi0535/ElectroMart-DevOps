import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import { setCategoryFilter } from '../../features/products/productSlice';
import { getCategories } from '../../data/products'; // Import the helper

const categories = getCategories();

const CategoryFilter = () => {
  const dispatch = useDispatch();
  const currentCategory = useSelector((state) => state.products.categoryFilter);

  const handleChange = (event) => {
    dispatch(setCategoryFilter(event.target.value));
  };

  return (
    <FormControl component="fieldset" sx={{ width: '100%' }}>
      <FormLabel component="legend">Category</FormLabel>
      <RadioGroup
        aria-label="category"
        name="category-filter"
        value={currentCategory}
        onChange={handleChange}
      >
        {categories.map((category) => (
          <FormControlLabel
            key={category}
            value={category}
            control={<Radio />}
            label={category}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default CategoryFilter;