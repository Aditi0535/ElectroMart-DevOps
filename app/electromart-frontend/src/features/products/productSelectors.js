import { createSelector } from '@reduxjs/toolkit';
import { products as allProducts } from '../../data/products'; // Import the raw data

// Basic selectors for filter/sort state
const selectCategoryFilter = (state) => state.products.categoryFilter;
const selectSortOrder = (state) => state.products.sortOrder;
const selectSearchQuery = (state) => state.products.searchQuery;

// Memoized selector to get the final list of products
export const selectFilteredAndSortedProducts = createSelector(
  [selectCategoryFilter, selectSortOrder, selectSearchQuery],
  (category, sort, query) => {
    let filteredProducts = [...allProducts];

    // 1. Filter by Category
    if (category !== 'All') {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }

    // 2. Filter by Search Query (name or description)
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseQuery) ||
          product.description.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // 3. Sort
    switch (sort) {
      case 'price_asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // No sorting or sort by ID (default)
        break;
    }

    return filteredProducts;
  }
);