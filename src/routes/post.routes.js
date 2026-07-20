const express = require('express');
const router = express.Router();
const { getPosts, getPostById, createPost, deletePost, addComment, updateComment, deleteComment, getMyPosts, updatePost, toggleLike, getPostsByUsername } = require('../controllers/post.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.route('/user/me')
  .get(protect, getMyPosts);

router.route('/author/:username')
  .get(getPostsByUsername);

router.route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.route('/:id/like')
  .put(protect, toggleLike);

router.route('/:id/comments')
  .post(protect, addComment);

router.route('/:id/comments/:commentId')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

module.exports = router;
