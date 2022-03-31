const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams lets us access params from parent route (need post_id)
const passport = require('passport');

const comment_controller = require('../../../controllers/commentController');

router.get('/', comment_controller.get_all_relevant);

router.post('/', comment_controller.create_one);

router.put(
  '/:commentid',
  passport.authenticate('jwt', { session: false }),
  comment_controller.update_one
);

router.delete(
  '/:commentid',
  passport.authenticate('jwt', { session: false }),
  comment_controller.delete_one
);

module.exports = router;
