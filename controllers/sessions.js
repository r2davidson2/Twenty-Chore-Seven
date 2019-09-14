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
    Parent.findOne({username:req.body.username}, (err, foundUser)=>{
        if(bcrypt.compareSync(req.body.password, foundUser.password)){
            // console.log(foundUser);
            req.session.currentUser = foundUser;
            res.status(201).json({
               status: 201,
               message: 'session created'
            })
        } else {
            res.status(401).json({
               status: 401,
               message: 'login failed'
            })
        }
    })
})

module.exports = router;
