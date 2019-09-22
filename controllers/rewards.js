const express = require('express');
const router = express.Router();
const Rewards = require('../models/rewards.js');

router.get('/', (req, res) => {
   Rewards.find({createdBy: req.session.currentUser._id}, (error, foundRewards) => {
      res.json(foundRewards);
   });
});

router.get('/store', (req, res) => {
   // console.log(req.session);
   Rewards.find({createdBy: req.session.currentUser.parent}, (error, foundRewards) => {
      res.json(foundRewards);
   });
});

router.delete('/:id', (req, res) => {
   Rewards.findByIdAndRemove(req.params.id, (error, deletedReward) => {
      res.json(deletedReward);
   });
});

router.put('/:id', (req, res) => {
   Rewards.findByIdAndUpdate(req.params.id, req.body, {new:true}, (error, updatedReward) => {
      res.json(updatedReward);
   });
});

router.post('/', (req, res) => {
   Rewards.create(req.body, (error, createdReward) => {
      res.json(createdReward);
   });
});

module.exports = router;
