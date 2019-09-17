const express = require('express');
const router = express.Router();
const Chores = require('../models/chores.js');
const Child = require('../models/child.js')

router.get('/', (req, res) => {
   Chores.findById(req.params.childId,  (error, deletedChore) => {
      res.json(deletedChore);
   });
});

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

// router.put('/update/:id', (req, res) => {
//    console.log(req.params);
//    console.log(req.body);
//    Child.update({_id: req.params.id, "chores.task" : req.body.task}, {`chores.${req.body.day}.completed`: true}, false, true)
// })




module.exports = router;
