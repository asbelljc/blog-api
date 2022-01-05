const mongoose = require('mongoose');
const { Schema } = mongoose;
const { DateTime } = require('luxon');

const validateEmail = function (email) {
  const re =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return re.test(email);
};

const CommentSchema = new Schema({
  body: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    // This check shouldn't run if field is left empty (it's optional) - test functionality.
    validate: [validateEmail, 'Please give a valid email address.'],
  },
  date_time: { type: Date, default: Date.now() },
});

CommentSchema.virtual('name').get(function () {
  return `${this.first_name} ${this.last_name}`;
});

CommentSchema.virtual('date_time_formatted').get(function () {
  const dtFormat = {
    ...DateTime.DATE_MED_WITH_WEEKDAY,
    ...DateTime.TIME_SIMPLE,
  };
  return this.date_time.toLocaleString(dtFormat);
});

module.exports = mongoose.model('Comment', CommentSchema);
