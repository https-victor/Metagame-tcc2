const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Game = require('../models/Game');

// @route   GET api/games
// @desc    Get all users games
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const games = await Game.find({ user: req.user.id }).sort({
      createdAt: -1
    });
    res.json(games);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server Error', type: 'server' }] });
  }
});

// @route   POST api/games
// @desc    Add new game
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    try {
        const newGame = new Game ({
            name, description, user: req.user.id
        });

        const game = await newGame.save();

        res.json(game);
    } catch (err) {
        console.error(err);
        res.status(500).json({errors:[{msg:'Server Error', type:'server'}]});
    }
  }
);

// @route   PUT api/games/:id
// @desc    Update game
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name, description } = req.body;

    const gameFields = {};
    if(name) gameFields.name = name;
    if(description) gameFields.description = description;

    try {
        let game = await Game.findById(req.params.id);
        
        if(!game) res.status(404).json({errors:[{msg:'Game not found',type:'database'}]});

        // Check if requesting user has permision to the database content
        if(game.user.toString() !== req.user.id){
            return res.status(401).json({errors:[{msg:'Not authorized',type:'authorization'}]});
        }

        game = await Game.findByIdAndUpdate(req.params.id, {$set: gameFields}, {new: true});

        res.json(game);
    } catch (err) {
        console.error(err);
        res.status(500).json({errors:[{msg:'Server Error', type:'server'}]});
    }
});

// @route   DELETE api/games/:id
// @desc    Delete game
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let game = await Game.findById(req.params.id);
        
        if(!game) res.status(404).json({errors:[{msg:'Game not found',type:'database'}]});

        // Check if requesting user has permision to the database content
        if(game.user.toString() !== req.user.id){
            return res.status(401).json({errors:[{msg:'Not authorized',type:'authorization'}]});
        }

        await Game.findByIdAndRemove(req.params.id);

        res.json({reports:[{msg:'Game deleted', type:'crud'}]});
    } catch (err) {
        console.error(err);
        res.status(500).json({errors:[{msg:'Server Error', type:'server'}]});
    }
});

module.exports = router;
