const express = require('express');
const router = express.Router();
const ExtraPoints = require('../models/extraPoints.js');
const Child = require('../models/child.js')

router.put('/:id', (req, res) => {
   Child.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, deletedChore) => {
      res.json(deletedChore);
   });
});

router.put('/update/:id', (req, res) => {
   Child.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, deletedChore) => {
      res.json(deletedChore);
   });
});

module.exports = router;
