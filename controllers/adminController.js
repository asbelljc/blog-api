const User = require('../models/user');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

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
      const newUser = await new User({
        username: req.body.username,
        password: req.body.password,
        admin: req.body.admin,
      }).save();

      const jwt = newUser.issueJwt();

      res.json({
        success: true,
        user: newUser,
        token: jwt.token,
        expiresIn: jwt.expires,
      });
    } catch (err) {
      next(err);
    }
  },
];

exports.login = async function (req, res, next) {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      res.status(401).json({ success: false, msg: 'Could not find user.' });
    }

    const isValidPassword = user.isValidPassword(req.body.password);

    if (isValidPassword) {
      const tokenObject = user.issueJwt();

      res.status(200).json({
        success: true,
        user: user,
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
      });
    } else {
      res.status(401).json({ success: false, msg: 'Password is incorrect.' });
    }
  } catch (err) {
    next(err);
  }
};

// TEST PROTECTED ROUTE
exports.get_protected = [
  passport.authenticate('jwt', { session: false }),
  function (req, res, next) {
    res.status(200).json({ success: true, msg: 'You are authorized!' });
  },
];

// exports.signup = [
//   body('username')
//     .trim()
//     .escape()
//     .custom(async function (username) {
//       try {
//         const existingUsername = await Author.findOne({ username: username });
//         if (existingUsername) {
//           throw new Error('Username is taken.');
//         }
//       } catch (err) {
//         throw new Error(err);
//       }
//     }),
//   body('password')
//     .isLength(8)
//     .withMessage('Password must be at least 8 characters.'),

//   async function (req, res, next) {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.json({
//         username: req.body.username,
//         errors: errors.array(),
//       });
//     }

//     passport.authenticate(
//       'signup',
//       { session: false },
//       function (err, user, info) {
//         if (err) {
//           return next(err);
//         }
//         res.json({
//           message: 'Signed up successfully.',
//           user: req.user,
//         });
//       }
//     )(req, res, next);
//   },
// ];

// exports.login = async function (req, res, next) {
//   passport.authenticate('login', async function (err, user, info) {
//     try {
//       if (err || !user) {
//         const error = new Error('Something went wrong.');
//         return next(error);
//       }

//       req.login(user, { session: false }, async function (error) {
//         if (error) return next(error);

//         const body = { _id: user._id, username: user.username };
//         const token = jwt.sign({ user: body }, process.env.SECRET, {
//           expiresIn: '1d',
//         });

//         return res.json({ token });
//       });
//     } catch (err) {
//       next(error);
//     }
//   })(req, res, next);
// };

// exports.logout = function (req, res) {
//   req.logout();
//   res.redirect('/');
// };
