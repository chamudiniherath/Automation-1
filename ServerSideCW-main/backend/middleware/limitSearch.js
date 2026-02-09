const User = require('../models/User');

const limitSearch = async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.isPaid) {
    return next(); // ✅ Paid user: skip limit
  }

  const now = new Date();

  if (user.searchCount >= 3) {
    const last = user.lastSearchTime ? new Date(user.lastSearchTime) : null;

    // ✅ Check if 10 minutes passed since last search
    if (last && now - last < 10 * 60 * 1000) {
      const remaining = Math.ceil((10 * 60 * 1000 - (now - last)) / 1000);
      return res.status(429).json({
        message: `Search limit reached. Please wait ${Math.ceil(remaining / 60)} minutes.`,
      });
    }

    // ✅ Reset count if time passed
    user.searchCount = 0;
  }

  // ✅ Update count & timestamp
  user.searchCount += 1;
  user.lastSearchTime = now;
  await user.save();

  next();
};

module.exports = limitSearch;
