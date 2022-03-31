const express = require('express');
const router = express.Router();
const passport = require('passport');

const post_controller = require('../../controllers/postController');

const commentsRouter = require('./comments');

// Posts routes
router.get('/', post_controller.get_all);

router.get('/:id', post_controller.get_one);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  post_controller.create_one
);

router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  post_controller.update_one
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  post_controller.delete_one
);

// Comments sub-routes get funneled into commentsRouter
router.use('/:id/comments', commentsRouter);

module.exports = router;
