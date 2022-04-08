const Comment = require('../models/comment');
const { body, validationResult } = require('express-validator');

exports.get_all_relevant = async function (req, res, next) {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).sort({
      date_time: -1,
    });
    if (!comments) {
      return res.status(404).json({ err: 'Comments not found.' });
    }
    res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
};

exports.create_one = [
  body('body').not().isEmpty({ ignore_whitespace: true }).escape(),
  body('username').isAlphanumeric(),

  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        data: req.body,
        errors: errors.array(),
      });
      return;
    }

    const { body, username, date_time } = req.body;
    const post = req.params.id;

    const newComment = new Comment({
      body,
      username,
      date_time,
      post,
    });

    try {
      await newComment.save();
      return res.status(201).json({ newComment });
    } catch (err) {
      next(err);
    }
  },
];

exports.update_one = [
  body('body').not().isEmpty({ ignore_whitespace: true }).escape(),
  body('username').isAlphanumeric(),

  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        data: req.body,
        errors: errors.array(),
      });
      return;
    }

    const { body, username, date_time } = req.body;
    const post = req.params.id;

    try {
      const comment = await Comment.findByIdAndUpdate(req.params.commentid, {
        body,
        username,
        date_time,
        post,
      });
      if (!comment) {
        return res
          .status(404)
          .json({ err: `Comment (id: ${req.params.commentid}) not found.` });
      }
      return res.status(200).json({ comment });
    } catch (err) {
      next(err);
    }
  },
];

exports.delete_one = async function (req, res, next) {
  try {
    const deletedComment = await Comment.findByIdAndDelete(
      req.params.commentid
    );
    if (!deletedComment) {
      return res
        .status(404)
        .json({ err: `Comment (id: ${req.params.commentid}) not found.` });
    }
    return res.status(200).json({
      message: `Comment (id: ${req.params.commentid}) successfully deleted.`,
    });
  } catch (err) {
    next(err);
  }
};
