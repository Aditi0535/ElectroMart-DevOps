import { createSlice } from '@reduxjs/toolkit';

// This slice manages the *state* of filtering and sorting,
// not the products themselves (which come from data/products.js)
const initialState = {
  categoryFilter: 'All',
  sortOrder: 'default',
  searchQuery: '',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setCategoryFilter, setSortOrder, setSearchQuery } = productSlice.actions;
export default productSlice.reducer;