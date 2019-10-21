const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Game = require('../models/Game');

// @route   GET api/games
// @desc    Get all users games
// @access  Private
router.get('/', auth, async (req,res) => {
    try {
        const games = await Game.find({user: req.user.id}).sort({createdAt: -1});
        res.json(games);
    } catch (err) {
     console.error(err.message);
     res.status(500).json({errors:[{msg:'Server Error',type:'server'}]});
    }
});

// @route   POST api/games
// @desc    Add new game
// @access  Private
router.post('/', auth, (req,res) => {
    res.send('Add a new game');
});

// @route   PUT api/games/:id
// @desc    Update game
// @access  Private
router.put('/:id', auth, (req,res) => {
    res.send('Update game');
});

// @route   DELETE api/games/:id
// @desc    Delete game
// @access  Private
router.delete('/:id', auth, (req,res) => {
    res.send('Delete game');
});

module.exports = router;