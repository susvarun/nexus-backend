const Post = require('../models/Post.model');
const User = require('../models/User.model');
const Comment = require('../models/Comment.model');

// @route   GET /api/posts
exports.getPosts = async (req, res) => {
  try {
    const { search, tag } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tag) {
      query.tags = { $regex: `^${tag}$`, $options: 'i' };
    }

    const posts = await Post.find(query).populate('author', 'username email avatar').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/posts/:id
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username email avatar');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    const comments = await Comment.find({ post: req.params.id }).populate('author', 'username avatar').sort({ createdAt: -1 });
    
    res.json({ post, comments });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   POST /api/posts
exports.createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const post = new Post({ title, content, tags, author: req.user.id });
    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await post.deleteOne();
    await Comment.deleteMany({ post: req.params.id }); 
    res.json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   POST /api/posts/:id/comments
exports.addComment = async (req, res) => {
  try {
    const { text, parentComment } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = new Comment({
      text,
      post: req.params.id,
      author: req.user.id,
      parentComment: parentComment || null
    });

    const savedComment = await comment.save();
    const populatedComment = await savedComment.populate('author', 'username avatar');
    
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/posts/user/me
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id }).populate('author', 'username avatar').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/posts/:id
exports.updatePost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    let post = await Post.findById(req.params.id);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags || post.tags;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/posts/:id/like
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(userId => userId.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post.likes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/posts/author/:username
exports.getPostsByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: new RegExp(`^${req.params.username}$`, 'i') });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const posts = await Post.find({ author: user._id })
      .populate('author', 'username email avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/posts/:id/comments/:commentId
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    comment.text = req.body.text || comment.text;
    await comment.save();

    const comments = await Comment.find({ post: req.params.id }).populate('author', 'username avatar').sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   DELETE /api/posts/:id/comments/:commentId
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await comment.deleteOne();
    await Comment.deleteMany({ parentComment: req.params.commentId });

    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
