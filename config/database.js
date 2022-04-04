require('dotenv').config();

const mongoose = require('mongoose');

const dbUri = process.env.DB_STRING;

const connection = mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Database connected');
});

module.exports = connection;
