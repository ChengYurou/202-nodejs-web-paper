const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paperSchema = new Schema({
  paperName: String,
  paperInfo: String
});

module.exports = mongoose.model('Paper', paperSchema);