const express = require('express');
const router = express.Router();
const ExtraPoints = require('../models/extraPoints.js');

router.get('/', (req, res) => {
   // console.log(req.session.currentUser);
   ExtraPoints.find({createdBy: req.session.currentUser._id}, (err, foundExtraPoints) => {
      // req.session.foundExtraPoints = foundExtraPoints
      res.json(foundExtraPoints)
   })
})

router.post('/', (req, res) => {
   ExtraPoints.create(req.body, (error, createdExtraPointsChore) => {
      res.json(createdExtraPointsChore);
   });
});

router.delete('/:id', (req, res) => {
   console.log(req.params);
   ExtraPoints.findByIdAndRemove(req.params.id, (error, deletedExtraPointsChore) => {
      res.json(deletedExtraPointsChore)
   })
})

module.exports = router;
