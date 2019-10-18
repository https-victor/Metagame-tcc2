const express = require('express');
const router = express.Router();

// @route   GET api/games
// @desc    Get all users games
// @access  Private
router.get('/', (req,res) => {
    res.send('Get all users games');
});

// @route   POST api/games
// @desc    Add new game
// @access  Private
router.post('/', (req,res) => {
    res.send('Add a new game');
});

// @route   PUT api/games/:id
// @desc    Update game
// @access  Private
router.put('/:id', (req,res) => {
    res.send('Update game');
});

// @route   DELETE api/games/:id
// @desc    Delete game
// @access  Private
router.delete('/:id', (req,res) => {
    res.send('Delete game');
});

module.exports = router;