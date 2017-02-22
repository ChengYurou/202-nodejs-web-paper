const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
  title: String,
  homeworks: [{
    type: Schema.ObjectId,
    ref: 'Homework'
  }],
  paper: {
    type: Schema.ObjectId,
    ref: 'Paper'
  }
});

module.exports = mongoose.model('Section', sectionSchema);