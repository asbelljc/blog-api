require('dotenv').config();

const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

userSchema.methods.issueJwt = function () {
  const user = this;
  const { _id } = user;

  const expiresIn = '2w';

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, process.env.SECRET, { expiresIn });

  return {
    token: `Bearer ${signedToken}`,
    expires: expiresIn,
  };
};

module.exports = mongoose.model('User', userSchema);
