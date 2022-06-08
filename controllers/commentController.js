const Comment = require('../models/comment');
const { body, validationResult } = require('express-validator');
const isEqual = require('lodash/isEqual');

exports.get_all_relevant = async function (req, res, next) {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId })
      .populate('user')
      .sort({
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

  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        data: req.body,
        errors: errors.array(),
      });
      return;
    }

    const { body } = req.body;
    const post = req.params.id;
    const user = req.user._id;

    const newComment = new Comment({
      body,
      user,
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

  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        data: req.body,
        errors: errors.array(),
      });
      return;
    }

    const { body } = req.body;
    const post = req.params.id;
    const sessionUser = JSON.stringify(req.user);

    try {
      const comment = await Comment.findById(req.params.commentid).populate(
        'user'
      ); // Must populate user field to compare against user object stored in request by passport
      const commentAuthor = JSON.stringify(comment.user);

      if (!comment) {
        return res
          .status(404)
          .json({ err: `Comment (id: ${req.params.commentid}) not found.` });
      }

      if (!isEqual(sessionUser, commentAuthor)) {
        return res
          .status(403)
          .json({ err: 'You do not have permission to edit this comment.' });
      }

      await Comment.findByIdAndUpdate(req.params.commentid, {
        body,
        date_time: Date.now(),
      });

      return res.status(200).json({ comment });
    } catch (err) {
      next(err);
    }
  },
];

exports.delete_one = async function (req, res, next) {
  const sessionUser = JSON.stringify(req.user);

  try {
    const comment = await Comment.findById(req.params.commentid).populate(
      'user'
    );
    const commentAuthor = JSON.stringify(comment.user);

    if (!comment) {
      return res
        .status(404)
        .json({ err: `Comment (id: ${req.params.commentid}) not found.` });
    }

    if (!isEqual(sessionUser, commentAuthor)) {
      return res
        .status(403)
        .json({ err: 'You do not have permission to delete this comment.' });
    }

    await Comment.findByIdAndDelete(req.params.commentid);

    return res.status(200).json({
      message: `Comment (id: ${req.params.commentid}) successfully deleted.`,
    });
  } catch (err) {
    next(err);
  }
};
