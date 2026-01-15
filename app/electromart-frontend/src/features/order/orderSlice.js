import { createSlice } from '@reduxjs/toolkit';

// This slice holds the *result* of the successful order
// placed via the CheckoutPage's fetch call.
const initialState = {
  currentOrder: null, // This will hold the order object from the backend
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // This reducer is called *after* the fetch is successful
    placeOrder: (state, action) => {
      state.currentOrder = action.payload; // payload is the savedOrder from backend
      state.status = 'succeeded';
      state.error = null;
    },
    // You could add reducers for setting status to 'loading' or 'failed'
    setOrderStatus: (state, action) => {
        state.status = action.payload;
    },
    setOrderError: (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
    }
  },
});

export const { placeOrder, setOrderStatus, setOrderError } = orderSlice.actions;

// Selector to get the current order
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrderStatus = (state) => state.order.status;

export default orderSlice.reducer;