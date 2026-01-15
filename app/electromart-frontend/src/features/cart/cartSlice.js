import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // An array of { ...product, quantity }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add an item to the cart
    addItem: (state, action) => {
      const itemToAdd = action.payload;
      const existingItem = state.items.find((item) => item.id === itemToAdd.id);

      if (existingItem) {
        // If item exists, update its quantity, respecting stock
        existingItem.quantity = Math.min(
          existingItem.quantity + itemToAdd.quantity,
          existingItem.stock
        );
      } else {
        // If new item, add it to the cart
        state.items.push(itemToAdd);
      }
    },
    // Remove an item from the cart
    removeItem: (state, action) => {
      const idToRemove = action.payload;
      state.items = state.items.filter((item) => item.id !== idToRemove);
    },
    // Update an item's quantity
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const itemToUpdate = state.items.find((item) => item.id === id);
      if (itemToUpdate) {
        // Ensure quantity is between 1 and stock
        itemToUpdate.quantity = Math.max(1, Math.min(quantity, itemToUpdate.stock));
      }
    },
    // Clear all items from the cart
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;