const express = require('express');
const router = express.Router();
const { User } = require('../models/User');

router.post('/', async (req, res) => {
  try {
    const { cartItems, totalAmount, email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, orders: [] });
    }

    const newOrder = {
      items: cartItems,
      totalAmount,
    };

    user.orders.push(newOrder);
    await user.save();

    res.status(201).json({ message: 'Order saved successfully' });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Error saving order' });
  }
});

module.exports = router;
