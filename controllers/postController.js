const Post = require('../models/post');
const { body, validationResult } = require('express-validator');
const showdown = require('showdown');

exports.get_all = async function (req, res, next) {
  try {
    const posts = await Post.find({}, 'title slug date_time tags').sort({
      date_time: -1,
    });
    if (!posts) {
      return res.status(404).json({ err: 'Posts not found.' });
    }
    res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.get_one_by_slug = async function (req, res, next) {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug });

    if (!post) {
      return res.status(404).json({ err: `Post (slug: ${slug}) not found.` });
    }

    const markdownConverter = new showdown.Converter();
    post.markdown = markdownConverter.makeHtml(post.markdown);

    res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
};

exports.create_one = [
  body('title')
    .trim()
    .not()
    .isEmpty()
    .escape()
    .bail()
    .custom(async function (title) {
      try {
        const existingTitle = await Post.findOne({ title });
        if (existingTitle) {
          throw new Error('Another blog post has this title.');
        }
      } catch (err) {
        throw new Error(err);
      }
    }),

  body('slug')
    .trim()
    .not()
    .isEmpty()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .bail()
    .custom(async function (slug) {
      try {
        const existingSlug = await Post.findOne({ slug });
        if (existingSlug) {
          throw new Error('Another blog post has this slug.');
        }
      } catch (err) {
        throw new Error(err);
      }
    }),

  body('markdown').trim().not().isEmpty(),

  body('seo_title_tag').trim().not().isEmpty(),

  body('seo_meta_description').trim().not().isEmpty(),

  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        data: req.body,
        errors: errors.array(),
      });
      return;
    }

    const {
      title,
      slug,
      markdown,
      tags,
      date_time,
      seo_title_tag,
      seo_meta_description,
    } = req.body;
    const newPost = new Post({
      title,
      slug,
      markdown,
      tags,
      date_time,
      seo_title_tag,
      seo_meta_description,
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
  body('title').trim().not().isEmpty().escape(),

  body('slug')
    .trim()
    .not()
    .isEmpty()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),

  body('markdown').trim().not().isEmpty(),

  body('seo_title_tag').trim().not().isEmpty(),

  body('seo_meta_description').trim().not().isEmpty(),

  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        data: req.body,
        errors: errors.array(),
      });
      return;
    }

    const {
      title,
      slug,
      markdown,
      date_time,
      seo_title_tag,
      seo_meta_description,
    } = req.body;

    try {
      const post = await Post.findByIdAndUpdate(req.params.id, {
        title,
        slug,
        markdown,
        date_time,
        seo_title_tag,
        seo_meta_description,
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
