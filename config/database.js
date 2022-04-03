require('dotenv').config();

const mongoose = require('mongoose');

const connection = process.env.DB_STRING;

mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Database connected');
});
