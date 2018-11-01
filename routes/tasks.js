const express = require('express');
const router = express.Router();

// Bring in models
let Task = require('../models/task');

router.get('/add', function (req, res) {
  res.render('add_task', {
    title: 'Add'
  });
});

router.post('/add', function (req, res) {
  let task = new Task({
    task: req.body.task,
    notes: req.body.notes
  });

  task.save(function (err, task) {
    if (err) return console.error(err);

    req.flash('success', 'Task added successfullly.');
    res.redirect('/');
  });
});

module.exports = router;
