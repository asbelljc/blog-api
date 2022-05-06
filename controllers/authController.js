require('dotenv').config();

const User = require('../models/user');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const { v4: uuid } = require('uuid');

// add a non-httpOnly cookie to allow offline logout
function initSecondaryAuthCookie(req, res, next) {
  let token = uuid();

  res.cookie('secondaryAuthToken', token, {
    maxAge: 1000 * 60 * 60 * 24 * 14, // 2-week sessions
    httpOnly: false,
  });

  req.session.secondaryAuthToken = token;

  next();
}

// check that our second auth cookie is present/valid
exports.checkForOfflineLogout = async function (req, res, next) {
  if (req.isAuthenticated()) {
    let cookieToken = req.cookies.secondaryAuthToken;
    let sessionToken = req.session.secondaryAuthToken;

    if (sessionToken !== undefined) {
      if (cookieToken !== sessionToken) {
        // this means the user logged out while offline; log them out
        try {
          req.logout();
          req.session.destroy();
          next();
        } catch (err) {
          next(err);
        }
      }
    } else {
      // No token stored in session; create and assign one
      // This keeps existing sessions valid (backward compatibility)
      initSecondaryAuthCookie(req, res, next);
    }
  }
  next();
};

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
    .notEmpty()
    .withMessage('Username must not be blank.')
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
    .withMessage('Password must be at least 8 characters.'),

  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
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
  initSecondaryAuthCookie,
  function (req, res, next) {
    const status = req.user.admin ? 'admin' : 'user';
    const { username } = req.user;

    res.status(200).json({ session: { status, username } });
  },
];

// need this export syntax because logout is used by checkForOfflineLogout (within this file)
exports.logout = function (req, res, next) {
  try {
    req.logout();
    // session should already be destroyed by checkForOfflineLogout, but if somehow it isn't - destroy it
    req.session && req.session.destroy();
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
