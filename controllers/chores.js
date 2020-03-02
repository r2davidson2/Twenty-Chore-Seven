const express = require('express');
const router = express.Router();
const ExtraPoints = require('../models/extraPoints.js');
const Child = require('../models/child.js')

router.put('/:id', (req, res) => {
   Child.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, updatedChore) => {
      res.json(updatedChore);
   });
});

// BUY REWARD
router.put('/buy/:id', (req, res) => {
   // console.log(req.body);
   Child.findByIdAndUpdate(req.params.id, {
      $set: {points: req.body.points},
      $push: {rewards: req.body.rewards}
   }, {new:true}, (error, updatedChore) => {
      res.json(updatedChore);
   });
});

router.put('/update/:id', (req, res) => {
   Child.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, deletedChore) => {
      res.json(deletedChore);
   });
});

module.exports = router;
