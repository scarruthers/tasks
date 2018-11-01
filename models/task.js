const mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
  task: String,
  notes: String
});

let Task = module.exports = mongoose.model('Task', taskSchema);
