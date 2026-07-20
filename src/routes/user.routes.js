const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, toggleBookmark, getBookmarks, getBookmarkIds } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/profile').put(protect, updateUserProfile);
router.route('/bookmarks/ids').get(protect, getBookmarkIds);
router.route('/bookmarks').get(protect, getBookmarks);
router.route('/bookmarks/:postId').put(protect, toggleBookmark);
router.route('/:username').get(getUserProfile);

module.exports = router;
