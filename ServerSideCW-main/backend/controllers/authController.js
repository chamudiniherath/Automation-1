const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateApiKey = require('../utils/generateApiKey');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const apiKey = generateApiKey();
    const user = await User.create({ username, password: hashed, apiKey });
    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', detail: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const expiresIn = user.isAdmin ? '2h' : '20m';  // ⏳ Admin gets longer session

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin }, // ✅ include isAdmin in token
      process.env.JWT_SECRET,
      { expiresIn }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: user.isAdmin ? 2 * 60 * 60 * 1000 : 20 * 60 * 1000  // ⏱️ set maxAge in ms
    });


    // ✅ Include isAdmin in the response
    res.json({
      message: 'Logged in',
      isAdmin: user.isAdmin
    });

  } catch (err) {
    res.status(500).json({ error: 'Login failed', detail: err.message });
  }
};


exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

exports.session = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ userId: decoded.id, isAdmin: decoded.isAdmin });
  } catch (err) {
    return res.status(403).json({ message: 'Session expired or invalid' });
  }
};
