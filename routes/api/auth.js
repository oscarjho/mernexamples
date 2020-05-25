const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const auth = require('../../middleware/auth');

//Load model
const User = require('../../models/User');

// @route   GET api/auth/test
// @desc    testing routes
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Auth route is working' }));

// @route   POST api/auth/
// @desc    Auth User
// @access  Public
router.post('/', (req, res) => {
  const { email, password} = req.body;
  //Simple validation
  if (!email || !password) {
    return res.status(400).json({msg: 'Please enter all fields'});
  }
  // Check for existing user
  User.findOne({email}).then(user => {
    if(!user){
      return res.status(400).json({msg: 'User does not exist'})
    } 
    // Validate password
    bcrypt.compare(password, user.password).then(isMatch => {
      // If it dosnt match
      if(!isMatch) return res.status(400).json({msg: 'Invalid credentials'});
      // If it match
      jwt.sign({id: user.id}, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
        if(err) throw err;
        res.json({token, user: {id: user.id, email: user.email}});
      });
    })
  });
});

router.get('/user', auth, (req, res) => {
  User.findById(req.user.id)
    .select('-password')
    .then(user => res.json(user));
});

module.exports = router;
