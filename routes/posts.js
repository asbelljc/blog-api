const express = require('express');
const router = express.Router();
const passport = require('passport');

const post_controller = require('../controllers/postController');
const comment_controller = require('../controllers/commentController');

// Posts routes

router.get('/', post_controller.get_posts);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  post_controller.create_post
);

router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  post_controller.update_post
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  post_controller.delete_post
);

// Comments sub-routes

router.get('/:id/comments', comment_controller.get_comments);

router.post('/:id/comments', comment_controller.create_comment);

router.put(
  '/:id/comments/:commentid',
  passport.authenticate('jwt', { session: false }),
  comment_controller.update_comment
);

router.delete(
  '/:id/comments/:commentid',
  passport.authenticate('jwt', { session: false }),
  comment_controller.delete_comment
);

module.exports = router;
