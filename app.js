require('dotenv').config();

// Useful middlewares
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const passport = require('passport');

// Configure passport
require('./config/auth')(passport);

// Router
const router = require('./routes/index');

const app = express();

require('./config/database'); // configure db and open connection
app.use(passport.initialize()); // initialize passport on every request
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
