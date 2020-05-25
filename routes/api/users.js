const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

//Load model
const User = require('../../models/User');

// @route   GET api/items/test
// @desc    testing routes
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'User route is working' }));

// @route   POST api/items/
// @desc    Register new user
// @access  Public
router.post('/', (req, res) => {
  const {name, email, password} = req.body;
  //Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({msg: 'Please enter all fields'});
  }
  // Check for existing user
  User.findOne({email}).then(user => {
    if(user){
      return res.status(400).json({msg: 'User already exists'})
    } 
    const newUser = new User ({name, email, password});
    // Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err) throw err;
        newUser.password=hash;
        newUser.save().then(user => {
          jwt.sign({id: user.id}, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
            if(err) throw err;
            res.json({token, user: {id: user.id, email: user.email}});
          });
        });
      });
    });
  });
});

module.exports = router;
