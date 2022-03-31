const express = require('express');
const router = express.Router();
const passport = require('passport');

const comment_controller = require('../controllers/commentController');

router.get('/', comment_controller.get_comments);

router.post('/', comment_controller.create_comment);

router.put(
  '/:commentid',
  passport.authenticate('jwt', { session: false }),
  comment_controller.update_comment
);

router.delete(
  '/:commentid',
  passport.authenticate('jwt', { session: false }),
  comment_controller.delete_comment
);

module.exports = router;
