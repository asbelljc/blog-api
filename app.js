require('dotenv').config();

// Useful middlewares
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { checkForOfflineLogout } = require('./controllers/authController');

// Configure database and open connection
require('./config/database');

// Configure passport
require('./config/auth');

// Configure CORS
const safelist = [
  'https://www.jonathanasbell.com',
  'https://jonathanasbell.com',
  'https://www.admin.jonathanasbell.com',
  'https://admin.jonathanasbell.com',
];

const corsOptionsDelegate = (req, callback) => {
  const corsOptions = { credentials: true, origin: true };

  if (
    safelist.indexOf(req.header('Origin')) !== -1 ||
    req.url.startsWith('/assets/')
  ) {
    callback(null, corsOptions);
  } else {
    callback(new Error('bad origin'));
  }
};

// Get router
const router = require('./routes');

const app = express();

// Create and configure session store
mongoose.connection.on('connected', () => {
  console.log('Database connected');

  const sessionStore = new MongoStore({
    client: mongoose.connection.getClient(),
    collectionName: 'sessions',
  });

  const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 14, // 2-week sessions
    },
  };

  app.use(cors(corsOptionsDelegate));
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
  app.use(checkForOfflineLogout);

  app.use(router);
});

module.exports = app;
