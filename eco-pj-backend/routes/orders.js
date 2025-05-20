const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { shippingInfo, paymentMethod = 'cod' } = req.body; // Default to 'cod'
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );

    const order = new Order({
      userId: req.user.id,
      items: cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      })),
      total,
      shippingInfo,
      status: 'pending',
      paymentMethod,
    });

    await order.save();
    cart.items = []; // Clear cart
    await cart.save();

    res.json({ message: 'Order created successfully' });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(400).json({ message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('items.productId');
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;