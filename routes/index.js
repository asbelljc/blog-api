const express = require('express');
const router = express.Router();

const postsRouter = require('./posts');
const adminRouter = require('./admin');

// Only redirect GET requests to postsRouter; force use of /posts/* for requests that edit data
router.get('/', function (req, res, next) {
  res.redirect('/posts');
});

router.use('/posts', postsRouter);
router.use('/admin', adminRouter);

module.exports = router;
