const mongoose = require('mongoose');
const { Schema } = mongoose;
const { DateTime } = require('luxon');

const PostSchema = new Schema({
  title: { type: String, unique: true, required: true },
  slug: { type: String, unique: true, required: true },
  markdown: { type: String, required: true },
  // if now, published; if future, scheduled publish; if empty, unpublished
  tags: { type: [String], required: false },
  date_time: { type: Date, required: false },
  seo_title_tag: { type: String, required: true },
  seo_meta_description: { type: String, required: true },
});

// PostSchema.virtual('date_time_formatted').get(function () {
//   const dtFormat = {
//     ...DateTime.DATE_MED_WITH_WEEKDAY,
//     ...DateTime.TIME_SIMPLE,
//   };
//   return DateTime.fromJSDate(this.date_time).toLocaleString(dtFormat);
// });

module.exports = mongoose.model('Post', PostSchema);
