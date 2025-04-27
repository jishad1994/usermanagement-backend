const express = require('express');
const User = require('../models/user');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const router = express.Router();
const bcrypt=require('bcryptjs')

router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  const { search } = req.query;
  try {
    const query = search ? { $or: [{ username: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {};
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/users', authenticateToken, isAdmin, async (req, res) => {
  const { username, email, phone, password, role } = req.body;
  try {
    console.log(username, email, phone, password, role)
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, phone, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ message: error.message });
  }
});

router.put('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;