const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

// Get all users
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });
  res.json(users);
});

// Upgrade user to paid
router.post('/upgrade/:id', authenticateToken, isAdmin, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.isPaid = true;
  await user.save();
  res.json({ message: `${user.username} is now a paid user.` });
});

// Reset search count
router.post('/reset/:id', authenticateToken, isAdmin, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.searchCount = 0;
  user.lastSearchTime = null;
  await user.save();
  res.json({ message: `Search count reset for ${user.username}` });
});

module.exports = router;
