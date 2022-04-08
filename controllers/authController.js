require('dotenv').config();

const User = require('../models/user');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

exports.isAuth = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(401);
  }
};

exports.isAdmin = function (req, res, next) {
  if (req.isAuthenticated() && req.user.admin) {
    next();
  } else {
    res.sendStatus(401);
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
    res.status(200).json({ msg: 'You have successfully logged in.' });
  },
];

exports.logout = function (req, res, next) {
  req.logout();
  res.status(200).json({ msg: 'You have successfully logged out.' });
};

// BOTH TESTED SUCCESSFULLY; now will use isAuth and isAdmin middlewares elsewhere
//
// exports.get_protected = [
//   isAuth,
//   function (req, res, next) {
//     res.send('You made it to the protected route.');
//   },
// ];

// exports.get_admin = [
//   isAdmin,
//   function (req, res, next) {
//     res.send('You made it to the admin route.');
//   },
// ];
