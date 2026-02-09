const express = require('express');
const jwt = require('jsonwebtoken');
const limitSearch = require('../middleware/limitSearch');
const countryController = require('../controllers/countryController');

const router = express.Router();

// Auth middleware
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

// Routes
router.get('/', authenticateToken, countryController.getAllCountries);
router.get('/name/:name', authenticateToken, limitSearch, countryController.getCountryByName); // ✅ Fix

module.exports = router;