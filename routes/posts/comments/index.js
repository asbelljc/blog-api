const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams lets us access params from parent route (need post_id)

const comment_controller = require('../../../controllers/commentController');
const { isAuth } = require('../../../controllers/authController');

router.get('/', comment_controller.get_all_relevant);

router.post('/', isAuth, comment_controller.create_one);

router.put('/:commentid', isAuth, comment_controller.update_one);

router.delete('/:commentid', isAuth, comment_controller.delete_one);

module.exports = router;
