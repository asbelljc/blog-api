const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

const verify = async (username, password, done) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return done(null, false);
    }

    const isValidPassword = user.isValidPassword(password);

    if (isValidPassword) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    done(err);
  }
};

const strategy = new LocalStrategy(verify);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await User.findById(userId);

    done(null, user);
  } catch (err) {
    done(err);
  }
});

// require('dotenv').config();

// const User = require('../models/user');
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;

// const options = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.SECRET,
// };

// const strategy = new JwtStrategy(options, async (payload, done) => {
//   try {
//     const user = await User.findOne({ _id: payload.sub });

//     if (user) {
//       return done(null, user);
//     } else {
//       return done(null, false);
//     }
//   } catch (err) {
//     return done(err, null);
//   }
// });

// module.exports = (passport) => {
//   passport.use(strategy);
// };
