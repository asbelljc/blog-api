const express = require('express');
const router = express.Router();

const post_controller = require('../../controllers/postController');
const { isAdmin } = require('../../controllers/authController');

const commentsRouter = require('./comments');

// Posts routes
router.get('/', post_controller.get_all);

router.get('/:id', post_controller.get_one);

router.post('/', isAdmin, post_controller.create_one);

router.put('/:id', isAdmin, post_controller.update_one);

router.delete('/:id', isAdmin, post_controller.delete_one);

// Comments sub-routes get funneled into commentsRouter
router.use('/:id/comments', commentsRouter);

module.exports = router;
