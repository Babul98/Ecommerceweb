const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check stock availability
    for (let item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.product.name}` 
        });
      }
    }

    const subtotal = cart.totalAmount;
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: item.product.images[0]
    }));

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      total
    });

    if (paymentMethod === 'card') {
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          orderId: order._id.toString(),
          userId: req.user.id.toString()
        }
      });

      order.stripePaymentIntentId = paymentIntent.id;
    }

    await order.save();

    // Update product stock
    for (let item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json({
      message: 'Order created successfully',
      order,
      clientSecret: paymentMethod === 'card' ? 
        (await stripe.paymentIntents.retrieve(order.stripePaymentIntentId)).client_secret : 
        null
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    }).populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const order = await Order.findOne({ stripePaymentIntentId: paymentIntentId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = 'paid';
    await order.save();

    res.json({ message: 'Payment confirmed', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  confirmPayment
};
