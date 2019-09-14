const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const Parent = require('../models/parent.js');
const Child = require('../models/child.js');

router.post('/parent', (req, res)=>{
   Parent.findOne({ username: req.body.username }, (err, foundUser)=>{
      if(foundUser === null){
         req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
         Parent.create(req.body, (err, createdUser)=>{
            res.status(201).json({
               status: 201,
               message: 'user created'
            })
         });
      } else {
         res.json("Username already exists!");
      }
   })
});

router.post('/child', (req, res)=>{
   Child.findOne({ username: req.body.username }, (err, foundUser)=>{
      if(foundUser === null){
         req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
         Child.create(req.body, (err, createdUser)=>{
            res.status(201).json({
               status: 201,
               message: 'user created'
            })
         });
      } else {
         res.json("Username already exists!");
      }
   })
});

router.get('/child', (req, res) => {
   // console.log(req.session.currentUser);
   Child.find({parent: req.session.currentUser._id}, (err, foundChildren) => {
      // console.log(foundChildren);
      req.session.foundChildren = foundChildren
      res.json(foundChildren)
   })
})

router.get('/child/:id', (req, res) => {
   Child.findById(req.params.id, (err, foundChild) => {
      res.json(foundChild)
   })
});

router.put('/child/:id', (req, res) => {
   Child.findByIdAndUpdate(req.params.id, {$push: {chores: req.body}}, {new:true}, (error, updatedChore) => {
      res.json(updatedChore);
   });
});

module.exports = router;
