const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const csrfProtection = require('../middleware/csrfProtection');

// ❌ CSRF NOT required
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/session', authController.session);

// ✅ CSRF required
router.post('/logout', csrfProtection, authController.logout);

module.exports = router;
