require('dotenv').config();

const User = require('../models/user');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

// Route protector #1
exports.isAuth = function (req, res, next) {
  try {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    next(err);
  }
};

// Route protector #2
exports.isAdmin = function (req, res, next) {
  try {
    if (req.isAuthenticated() && req.user.admin) {
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    next(err);
  }
};

exports.signup = [
  body('username')
    .trim()
    .escape()
    .custom(async function (username) {
      try {
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
          throw new Error('Username is taken.');
        }
      } catch (err) {
        throw new Error(err);
      }
    }),

  body('password')
    .isLength(8)
    .withMessage('Password must be at least 8 characters long.'),

  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        username: req.body.username,
        errors: errors.array(),
      });
    }

    try {
      await new User({
        username: req.body.username,
        password: req.body.password,
        admin: req.body.admin && req.body.admin == process.env.ADMIN_PASSWORD,
      }).save();

      res.status(201).json({ msg: 'You have successfully registered.' });
    } catch (err) {
      next(err);
    }
  },
];

exports.login = [
  passport.authenticate('local'),
  function (req, res, next) {
    const status = req.user.admin ? 'admin' : 'user';
    const { username } = req.user;

    res.status(200).json({ session: { status, username } });
  },
];

exports.logout = function (req, res, next) {
  try {
    req.logout();
    res.status(200).json({ msg: 'You have successfully logged out.' });
  } catch (err) {
    next(err);
  }
};

exports.session = function (req, res, next) {
  try {
    let session;

    if (req.isAuthenticated()) {
      const status = req.user.admin ? 'admin' : 'user';
      const { username } = req.user;

      session = { status, username };
    } else {
      session = null;
    }

    res.status(200).json({ session });
  } catch (err) {
    next(err);
  }
};
