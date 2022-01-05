const mongoose = require('mongoose');
const { Schema } = mongoose;
const { DateTime } = require('luxon');

const PostSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  date_time: { type: Date, default: Date.now() },
  isPublished: { type: Boolean, default: false },
});

PostSchema.virtual('date_time_formatted').get(function () {
  const dtFormat = {
    ...DateTime.DATE_MED_WITH_WEEKDAY,
    ...DateTime.TIME_SIMPLE,
  };
  return this.date_time.toLocaleString(dtFormat);
});

module.exports = mongoose.model('Post', PostSchema);
