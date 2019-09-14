const express = require('express');
const router = express.Router();
const Chores = require('../models/chores.js');

router.get('/', (req, res) => {
   Chores.find({}, (error, foundChores) => {
      res.json(foundChores);
   });
});



router.post('/', (req, res) => {
   Chores.create(req.body, (error, createdChore) => {
      res.json(createdChore);
   });
});

module.exports = router;
