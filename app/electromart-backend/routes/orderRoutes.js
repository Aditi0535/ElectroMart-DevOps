const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    // Destructure the expected data from the request body
    const { items, customer, total } = req.body;

    // Basic validation
    if (!items || !customer || !total) {
      return res.status(400).json({ message: 'Missing required order data' });
    }

    // Create a new order instance using the Order model
    const newOrder = new Order({
      items,
      customer,
      total,
    });

    // Save the new order to the database
    const savedOrder = await newOrder.save();

    // Respond with the saved order and a 201 (Created) status
    // The frontend's Redux logic depends on getting this savedOrder object back
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Server error: Failed to create order' });
  }
});

/**
 * @route   GET /api/orders
 * @desc    Get all orders (for debugging or future "order history" feature)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Find all orders and sort them by creation date (newest first)
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Server error: Failed to fetch orders' });
  }
});

module.exports = router;