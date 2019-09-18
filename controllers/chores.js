const express = require('express');
const router = express.Router();
const ExtraPoints = require('../models/extraPoints.js');
const Child = require('../models/child.js')

// router.get('/', (req, res) => {
//    Chores.findById(req.params.childId,  (error, deletedChore) => {
//       res.json(deletedChore);
//    });
// });

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

router.get('/extrapoints', (req, res) => {
   // console.log(req.session.currentUser);
   ExtraPoints.find({createdBy: req.session.currentUser._id}, (err, foundExtraPoints) => {
      // console.log(foundChildren);
      req.session.foundExtraPoints = foundExtraPoints
      res.json(foundExtraPoints)
   })
})

router.post('/extrapoints', (req, res) => {
   ExtraPoints.create(req.body, (error, createdExtraPointsChore) => {
      res.json(createdExtraPointsChore);
   });
});

// router.put('/update/:id', (req, res) => {
//    console.log(req.params);
//    console.log(req.body);
//    Child.update({_id: req.params.id, "chores.task" : req.body.task}, {`chores.${req.body.day}.completed`: true}, false, true)
// })




module.exports = router;
