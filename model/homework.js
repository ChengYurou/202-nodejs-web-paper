const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const homeworkSchema = new Schema({
  name:String,
  description:String
});

module.exports = mongoose.model('Homework', homeworkSchema);