const express = require('express');
const router = express.Router();
const Chores = require('../models/chores.js');
const Child = require('../models/child.js')

router.get('/', (req, res) => {
   Child.findById(req.params.id, {$pull: {chores: req.body.task}}, {new:true}, (error, deletedChore) => {
      res.json(deletedChore);
   });
});


router.delete('/:id', (req, res) => {
   Chores.findByIdAndRemove(req.params.id, (error, deletedChore) => {
      res.json(deletedChore);
   });
});


module.exports = router;
