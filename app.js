require('dotenv').config();

// Useful middlewares
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Configure database and open connection
require('./config/database');

// Configure passport
require('./config/auth');

// Create and configure session store
const sessionStore = new MongoStore({
  client: mongoose.connection.getClient(),
  collectionName: 'sessions',
});

const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 14, // 2-week sessions
  },
};

// Get router
const router = require('./routes');

const app = express();

app.use(session(sessionOptions));
app.use(passport.initialize()); // initialize passport on every request
app.use(passport.session());
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Not 100% sure on this one...
app.use(compression());

app.use(router);

// TODO: make error handler

module.exports = app;
