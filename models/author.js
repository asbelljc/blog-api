const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const AuthorSchema = new Schema({
  username: { required: true, type: String },
  password: { required: true, type: String },
});

AuthorSchema.pre('save', async function (next) {
  const author = this;
  const hashedPassword = await bcrypt.hash(author.password, 10);

  author.password = hashedPassword;
  next();
});

AuthorSchema.methods.isValidPassword = async function (password) {
  const author = this;
  const isMatch = await bcrypt.compare(password, author.password);

  return isMatch;
};

const AuthorModel = mongoose.model('Author', AuthorSchema);

module.exports = AuthorModel;
