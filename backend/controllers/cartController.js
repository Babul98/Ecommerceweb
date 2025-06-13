const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId && 
      item.size === size && 
      item.color === color
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        size,
        color,
        price: product.price
      });
    }

    cart.calculateTotal();
    await cart.save();
    await cart.populate('items.product');

    res.json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const product = await Product.findById(item.product);
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    item.quantity = quantity;
    cart.calculateTotal();
    await cart.save();
    await cart.populate('items.product');

    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items.pull(itemId);
    cart.calculateTotal();
    await cart.save();
    await cart.populate('items.product');

    res.json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
