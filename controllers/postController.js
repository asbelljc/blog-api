const Post = require('../models/post');
const { body, validationResult } = require('express-validator');

exports.get_all = async function (req, res, next) {
  try {
    const posts = await Post.find({}).sort({ date_time: -1 });
    if (!posts) {
      return res.status(404).json({ err: 'Posts not found.' });
    }
    res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.get_one = async function (req, res, next) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ err: `Post (id: ${req.params.id}) not found.` });
    }
    res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
};

exports.create_one = [
  body('title').not().isEmpty().trim().escape(),
  body('body').not().isEmpty().trim().escape(),

  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        data: req.body,
        errors: errors.array(),
      });
      return;
    }

    const { title, body, date_time, isPublished } = req.body;
    const newPost = new Post({
      title,
      body,
      date_time,
      isPublished,
    });

    try {
      await newPost.save();
      return res.status(201).json({ newPost });
    } catch (err) {
      next(err);
    }
  },
];

exports.update_one = [
  body('title').not().isEmpty().trim().escape(),
  body('body').not().isEmpty().trim().escape(),

  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        data: req.body,
        errors: errors.array(),
      });
      return;
    }

    const { title, body, date_time, isPublished } = req.body;

    try {
      const post = await Post.findByIdAndUpdate(req.params.id, {
        title,
        body,
        date_time,
        isPublished,
      });
      if (!post) {
        return res
          .status(404)
          .json({ err: `Post (id: ${req.params.id}) not found.` });
      }
      return res.status(200).json({ post });
    } catch (err) {
      next(err);
    }
  },
];

exports.delete_one = async function (req, res, next) {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res
        .status(404)
        .json({ err: `Post (id: ${req.params.id}) not found.` });
    }
    return res
      .status(200)
      .json({ message: `Post (id: ${req.params.id} successfully deleted.)` });
  } catch (err) {
    next(err);
  }
};
