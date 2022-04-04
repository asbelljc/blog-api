require('dotenv').config();

const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  username: { required: true, type: String },
  password: { required: true, type: String },
  admin: { default: false, type: Boolean },
});

userSchema.pre('save', async function (next) {
  const user = this;
  const hashedPassword = await bcrypt.hash(user.password, 10);

  user.password = hashedPassword;
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const isMatch = await bcrypt.compare(password, user.password);

  return isMatch;
};

module.exports = mongoose.model('User', userSchema);
