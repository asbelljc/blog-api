require('dotenv').config();

// Useful middlewares
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

// Authentication stuff
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJWT;

// Need author model for login/sign-up authentication
const Author = require('./models/author');

// Router
const router = require('./routes/index');

const app = express();

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Not 100% sure on this one...
app.use(compression());
// Almost certainly won't need this one...
// app.use(express.static(path.join(__dirname, 'public')));

app.use(router);

module.exports = app;
