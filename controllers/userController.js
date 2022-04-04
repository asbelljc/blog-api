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
        admin: req.body.admin,
      }).save();

      res.status(201).json({ msg: 'You have successfully registered.' });
    } catch (err) {
      next(err);
    }
  },
];

exports.get_protected = [
  isAuth,
  function (req, res, next) {
    res.send('You made it to the protected route.');
  },
];

exports.get_admin = [
  isAdmin,
  function (req, res, next) {
    res.send('You made it to the admin route.');
  },
];

// exports.signup = [
//   body('username')
//     .trim()
//     .escape()
//     .custom(async function (username) {
//       try {
//         const existingUsername = await User.findOne({ username });
//         if (existingUsername) {
//           throw new Error('Username is taken.');
//         }
//       } catch (err) {
//         throw new Error(err);
//       }
//     }),

//   body('password')
//     .isLength(8)
//     .withMessage('Password must be at least 8 characters long.'),

//   async function (req, res, next) {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.json({
//         username: req.body.username,
//         errors: errors.array(),
//       });
//     }

//     try {
//       const newUser = await new User({
//         username: req.body.username,
//         password: req.body.password,
//         admin: req.body.admin,
//       }).save();

//       const jwt = newUser.issueJwt();

//       res.json({
//         success: true,
//         user: newUser,
//         token: jwt.token,
//         expiresIn: jwt.expires,
//       });
//     } catch (err) {
//       next(err);
//     }
//   },
// ];

// exports.login = async function (req, res, next) {
//   try {
//     const user = await User.findOne({ username: req.body.username });

//     if (!user) {
//       res.status(401).json({ success: false, msg: 'Could not find user.' });
//     }

//     const isValidPassword = await user.isValidPassword(req.body.password);

//     if (isValidPassword) {
//       const jwt = user.issueJwt();

//       res.status(200).json({
//         success: true,
//         user: user,
//         token: jwt.token,
//         expiresIn: jwt.expires,
//       });
//     } else {
//       res.status(401).json({ success: false, msg: 'Password is incorrect.' });
//     }
//   } catch (err) {
//     next(err);
//   }
// };

// // TEST PROTECTED ROUTE
// exports.get_protected = [
//   passport.authenticate('jwt', { session: false }),

//   function (req, res, next) {
//     res.status(200).json({ success: true, msg: 'You are authorized!' });
//   },
// ];
