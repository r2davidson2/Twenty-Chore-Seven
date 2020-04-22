const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const Parent = require('../models/parent.js');
const Child = require('../models/child.js');

router.delete('/', (req, res) => {
   req.session.destroy(() => {
      res.status(200).json({
           status: 200,
           message: 'logout complete'
        })
   })
});

router.post('/', (req, res)=>{
    Parent.findOne({username:req.body.username}, (err, foundUser)=> {
      // console.log('foundUser: ' foundUser);
      if (foundUser === null) {
         Child.findOne({username:req.body.username}, (err, foundUser)=> {
            if (foundUser === null) {
              res.status(401).json({
                 status: 401,
                 message: 'login failed'
              })
            } else if(bcrypt.compareSync(req.body.password, foundUser.password)){
               req.session.currentUser = foundUser;
               res.status(201).json({
                     status: 201,
                     message: 'session created',
                     user: req.session.currentUser
               })
            } else {
                  res.status(401).json({
                     status: 401,
                     message: 'login failed'
                  })
            }
         })
      } else {
         if(bcrypt.compareSync(req.body.password, foundUser.password)){
            req.session.currentUser = foundUser;
            res.status(201).json({
               status: 201,
               message: 'session created',
               user: req.session.currentUser
            })
         } else {
            res.status(401).json({
               status: 401,
               message: 'login failed'
            })
         }
      }
   })
})

module.exports = router;
