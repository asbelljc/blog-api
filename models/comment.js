const mongoose = require('mongoose');
const { Schema } = mongoose;
const { DateTime } = require('luxon');

const CommentSchema = new Schema({
  body: { type: String, required: true },
  username: { type: String, required: true }, // does this need to reference user?
  date_time: { type: Date, default: Date.now() },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
});

CommentSchema.virtual('date_time_formatted').get(function () {
  const dtFormat = {
    ...DateTime.DATE_MED_WITH_WEEKDAY,
    ...DateTime.TIME_SIMPLE,
  };
  return this.date_time.toLocaleString(dtFormat);
});

module.exports = mongoose.model('Comment', CommentSchema);
