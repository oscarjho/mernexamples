const express = require('express');
const router = express.Router();
//Load model
const Item = require('../../models/Item');

// @route   GET api/items/test
// @desc    testing routes
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Item route is working' }));

// @route   GET api/items/
// @desc    Get All Items
// @access  Public
router.get('/', (req, res) => {
  Item.find().sort({date:-1}).then(items=>res.json(items))
});

// @route   POST api/items/
// @desc    Create a item
// @access  Public -atm-
router.post('/', (req, res) => {
  const newItem = new Item({
    name: req.body.name
  });
  newItem.save().then(item => res.json(item));
});

// @route   DELETE api/items/:id
// @desc    DELETE a item
// @access  Public -atm-
router.delete('/:id', (req, res) => {
  Item
  .findById(req.params.id)
  .then(item => item.remove().then(() => res.json({delete: true})))
  .catch( err => res.status(404).json({delete: false}));
});

module.exports = router;
