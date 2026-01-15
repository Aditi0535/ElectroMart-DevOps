// src/features/cart/cartSelectors.js

import { createSelector } from '@reduxjs/toolkit';

// Basic selector for the cart items
// FIX: Export this selector so it can be used in other files (CartPage, CheckoutPage)
export const selectCartItems = (state) => state.cart.items;

// Selector to calculate the total number of items in the cart
export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);

// Selector to calculate the subtotal price of all items
export const selectCartSubtotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.price * item.quantity, 0)
);

// Selector to calculate the total (subtotal + shipping, etc.)
// For now, total is just the subtotal.
export const selectCartTotal = createSelector(
  [selectCartSubtotal],
  (subtotal) => subtotal
);