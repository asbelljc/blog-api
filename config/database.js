require('dotenv').config();

const mongoose = require('mongoose');

mongoose.set('toJSON', { virtuals: true });

const dbUri = process.env.DB_STRING;

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
