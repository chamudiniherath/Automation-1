require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const sequelize = require('./database');
const authRoutes = require('./routes/authRoutes');
const countryRoutes = require('./routes/countryRoutes');
const csrfProtection = require('./middleware/csrfProtection');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ✅ CSRF protection only for this route (safe, separate)
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// ✅ Mount routes
app.use('/api/auth', authRoutes);         // includes /session, /login, /logout
app.use('/api/countries', countryRoutes); // your countries logic
app.use('/api/admin', adminRoutes);

// Sync database
sequelize.sync({ alter: true })
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Database sync error:', err));

  
  const listEndpoints = require('express-list-endpoints');
  console.log(listEndpoints(app));
  
module.exports = app;
