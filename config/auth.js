const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

const verify = async (username, password, done) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return done(null, false);
    }

    const isValidPassword = await user.isValidPassword(password);

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
