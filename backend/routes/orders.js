// routes/orders.js
const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  confirmPayment
} = require('../controllers/orderController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createOrder);
router.get('/', auth, getOrders);
router.get('/:id', auth, getOrder);
router.post('/confirm-payment', auth, confirmPayment);

// Admin routes
router.put('/:id/status', adminAuth, updateOrderStatus);

module.exports = router;
