const mongoose = require('mongoose');

// This schema defines the structure for a customer order
const orderSchema = new mongoose.Schema(
  {
    // `items` will be a direct copy of the cart items from the frontend
    items: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        imageUrl: String,
      },
    ],
    // `customer` object will store the shipping/billing info
    customer: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    // `total` will store the final calculated total from the frontend
    total: {
      type: Number,
      required: true,
    },
  },
  {
    // `timestamps: true` automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);