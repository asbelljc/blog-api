const express = require('express');
const router = express.Router();
const path = require('path');

const postsRouter = require('./posts');
const authRouter = require('./auth');

// Only redirect GET requests to postsRouter; force use of /posts/* for requests that edit data
router.get('/', function (req, res, next) {
  res.redirect('/posts');
});

router.use('/posts', postsRouter);
router.use('/auth', authRouter);
// For image hosting
router.use(
  '/assets',
  express.static(path.join(__dirname, '..', '..', 'assets'))
);

module.exports = router;
