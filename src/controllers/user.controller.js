const User = require('../models/User.model');

// @route   GET /api/users/:username
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: new RegExp(`^${req.params.username}$`, 'i') }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/users/profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;
    await user.save();
    
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/users/bookmarks/:postId
exports.toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const postId = req.params.postId;

    if (user.bookmarks.includes(postId)) {
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== postId);
    } else {
      user.bookmarks.push(postId);
    }
    
    await user.save();
    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/users/bookmarks
exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'bookmarks',
      populate: { path: 'author', select: 'username email' }
    });
    res.json(user.bookmarks.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/users/bookmarks/ids
exports.getBookmarkIds = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
