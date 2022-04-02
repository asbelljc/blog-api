require('dotenv').config();
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const Author = require('../models/author');

passport.use(
  'signup',
  new localStrategy(
    // this first parameter is unnecessary; as per the passport docs, usernameField defaults to 'username' and passwordField defaults to 'password'. Used strictly for learning purposes.
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async function (username, password, done) {
      try {
        const user = await Author.create({ username, password });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async function (username, password, done) {
      try {
        const user = await Author.findOne({ username });

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const isValid = await user.isValidPassword(password);

        if (!isValid) {
          return done(null, false, { message: 'Wrong password' });
        }

        return done(null, user, { message: 'Logged in successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async function (token, done) {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
