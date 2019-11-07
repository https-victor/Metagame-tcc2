const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Game = require('../models/Game');
const mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

// @route   GET api/games/:filter?
// @desc    Get all users games
// @access  Private
router.get('/:filter?', auth, async (req, res) => {
  try {
    switch (req.params.filter) {
      case 'my': {
        const myGames = await Game.find({
          gmId: req.user.id,
          status: true
        }).sort({
          createdAt: -1
        });
        res.json([...myGames]);
      }
      case 'subscribed': {
        const { games } = await User.findById(req.user.id, 'games');
        const otherGames = await Game.find({
          _id: { $in: games },
          status: true
        });
        res.json([...otherGames]);
      }
      case 'all': {
        const myGames = await Game.find({
          gmId: req.user.id,
          status: true
        }).sort({
          createdAt: -1
        });

        const { games } = await User.findById(req.user.id, 'games');
        const otherGames = await Game.find({
          _id: { $in: games },
          status: true
        });
        res.json([...myGames, ...otherGames]);
      }
      default: {
        if (req.params.filter) {
          try {
            let game = await Game.findById(req.params.filter);
            if (!game)
              res
                .status(404)
                .json({
                  errors: [{ msg: 'Game not found', type: 'database' }]
                });

            if (!game.status)
              res.status(400).json({
                errors: [
                  {
                    msg: 'The game is deactivated from the database',
                    type: 'database'
                  }
                ]
              });
            const { players, notes, tokens, ...restGame } = game;
            const fullPlayers = await User.find({_id: { $in: players}, status: true}).select('_id name email');
            const fullNotes = await User.find({ _id: { $in: notes } });
            const fullTokens = await User.find({ _id: { $in: tokens } });

            res.json({ ...restGame._doc, players: fullPlayers, notes: fullNotes, tokens: fullTokens  });
          } catch (err) {
            console.error(err.message);
            res
              .status(500)
              .json({ errors: [{ msg: 'Server Error', type: 'server' }] });
          }
        } else{
        const myGames = await Game.find({
          gmId: req.user.id,
          status: true
        }).sort({
          createdAt: -1
        });

        const { games } = await User.findById(req.user.id, 'games');
        const otherGames = await Game.find({
          _id: { $in: games },
          status: true
        });
        res.json({ myGames, otherGames });
      }
    }
    }
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
      const {_id, name: username, email} = await User.findById(req.user.id).select('_id name email');
      const newGame = new Game({
        name,
        description,
        gmId: req.user.id,
        players: [{ _id, name: username, email}]
      });

      const game = await newGame.save();

      res.json(game);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ errors: [{ msg: 'Server Error', type: 'server' }] });
    }
  }
);

// @route   PUT api/games/:id
// @desc    Update game
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, description, tokens, notes } = req.body;

  const gameFields = {};
  if (name) gameFields.name = name;
  if (description) gameFields.description = description;
  if (tokens) gameFields.tokens = tokens;
  if (notes) gameFields.notes = notes;
  gameFields.updatedAt = Date.now();

  try {
    let game = await Game.findById(req.params.id);

    if (!game)
      res
        .status(404)
        .json({ errors: [{ msg: 'Game not found', type: 'database' }] });

    if (!game.status)
      res.status(400).json({
        errors: [
          {
            msg: 'The game is deactivated from the database',
            type: 'database'
          }
        ]
      });

    // Check if requesting user has permision to the database content
    if (game.gmId.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ errors: [{ msg: 'Not authorized', type: 'authorization' }] });
    }

    game = await Game.findByIdAndUpdate(
      req.params.id,
      { $set: gameFields },
      { new: true }
    );

    res.json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server Error', type: 'server' }] });
  }
});

// @route   POST api/games/:id/tokens/
// @desc    Add new token
// @access  Private
router.post('/:id/tokens', [auth,[
      check('name', 'Name is required')
        .not()
        .isEmpty()
    ]], async (req, res) => {
  let game = await Game.findById(req.params.id);

  if (!game)
    res
      .status(404)
      .json({ errors: [{ msg: 'Game not found', type: 'database' }] });

  if (!game.status)
    res.status(400).json({
      errors: [
        {
          msg: 'The game is deactivated from the database',
          type: 'database'
        }
      ]
    });

  // Check if requesting user has permision to the database content
  if (game.gmId.toString() !== req.user.id) {
    return res
      .status(401)
      .json({ errors: [{ msg: 'Not authorized', type: 'authorization' }] });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { img, description, name } = req.body;

    const tokenFields = {};
    if (name) tokenFields.name = name;
    if (description) tokenFields.description = description;
    if (img) tokenFields.img = img;
    tokenFields._id = new ObjectId();
    tokenFields.createdAt = Date.now();
    const {_id, name: username, email} = await User.findById(req.user.id).select('_id name email');
    tokenFields.authorizedPlayers = [{ _id, name: username, email}];
    
    const updatedGame = await Game.findByIdAndUpdate(req.params.id,
      { $set: {tokens: tokenFields} },
      { new: true })
    res.json(updatedGame);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ errors: [{ msg: 'Server Error', type: 'server' }] });
  }
});

// @route   PUT api/games/:id/tokens/:tokenId
// @desc    Edit token
// @access  Private
router.put('/:id/tokens/:tokenId', [auth,[
      check('name', 'Name is required')
        .not()
        .isEmpty()
    ]], async (req, res) => {
  let game = await Game.findById(req.params.id);

  if (!game)
    res
      .status(404)
      .json({ errors: [{ msg: 'Game not found', type: 'database' }] });

  if (!game.status)
    res.status(400).json({
      errors: [
        {
          msg: 'The game is deactivated from the database',
          type: 'database'
        }
      ]
    });

  // Check if requesting user has permision to the database content
  if (game.gmId.toString() !== req.user.id) {
    return res
      .status(401)
      .json({ errors: [{ msg: 'Not authorized', type: 'authorization' }] });
  }
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { img, description, name, tokenSetup, type } = req.body;

    const tokens = game.tokens;
    let tokenFields = tokens.find((t)=>{
      return  t._id == req.params.tokenId;
  });
    if (name) tokenFields.name = name;
    if (description) tokenFields.description = description;
    if (img) tokenFields.img = img;
    if (type) tokenFields.type = type;
    if (tokenSetup) {
      if(tokenSetup.x) tokenFields.tokenSetup.x = tokenSetup.x;
      if(tokenSetup.y) tokenFields.tokenSetup.y = tokenSetup.y;
      if(tokenSetup.alpha) tokenFields.tokenSetup.alpha = tokenSetup.alpha;
      if(tokenSetup.scale) tokenFields.tokenSetup.scale = tokenSetup.scale;
      if(tokenSetup.hp) tokenFields.tokenSetup.hp = tokenSetup.hp;
    }
    tokenFields.updatedAt = Date.now();
    
    const updatedGame = await Game.findOneAndUpdate({
      _id: req.params.id,
      status: true,
      tokens: { _id: req.params.tokenId}
    },
      { $set: {tokens: [...tokens.filter(t=>t_id!=req.params.tokenId),tokenFields]} },
      { new: true })
    res.json(updatedGame);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ errors: [{ msg: 'Server Error', type: 'server' }] });
  }
});

// @route   POST api/games/:id/subscribe
// @desc    Subscribe to a game
// @access  Private
router.post('/:id/subscribe', auth, async (req, res) => {
  try {
    let game = await Game.findById(req.params.id);

    if (!game)
      res
        .status(404)
        .json({ errors: [{ msg: 'Game not found', type: 'database' }] });

    if (!game.status)
      res.status(400).json({
        errors: [
          {
            msg: 'The game is deactivated from the database',
            type: 'database'
          }
        ]
      });
    if (!(game.players.filter(playerId => playerId._id == req.user.id) == false)) {
      return res.status(404).json({
        errors: [
          { msg: 'You are already subscribed to this game', type: 'database' }
        ]
      });
    }
    const {_id, name, email} = await User.findById(req.user.id).select('_id name email')
    const newPlayers = [{ _id, name, email }, ...game.players];
    const newGames = [{ _id: game._id }, ...(req.user.games || [])];

    await User.findByIdAndUpdate(
      req.user.id,
      { $set: { games: newGames } },
      { new: true }
    );

    game = await Game.findByIdAndUpdate(
      req.params.id,
      { $set: { players: newPlayers } },
      { new: true }
    );

    res.json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server Error', type: 'server' }] });
  }
});

// @route   POST api/games/:id/unsubscribe
// @desc    Unsubscribe to a game
// @access  Private
router.post('/:id/unsubscribe', auth, async (req, res) => {
  try {
    let game = await Game.findById(req.params.id);

    if (!game)
      res
        .status(404)
        .json({ errors: [{ msg: 'Game not found', type: 'database' }] });

    if (!game.status)
      res.status(400).json({
        errors: [
          {
            msg: 'The game is deactivated from the database',
            type: 'database'
          }
        ]
      });
    if (game.players.filter(playerId => playerId._id == req.user.id) == false) {
      return res.status(404).json({
        errors: [
          {
            msg: 'You are already not subscribed to this game',
            type: 'database'
          }
        ]
      });
    }
    const newPlayers = game.players.filter(playerId => playerId._id != req.user.id);

    game = await Game.findByIdAndUpdate(
      req.params.id,
      { $set: { players: newPlayers } },
      { new: true }
    );

    res.json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server Error', type: 'server' }] });
  }
});

// @route   POST api/games/:id/unsubscribe/user
// @desc    Unsubscribe to a game
// @access  Private
router.post(
  '/:id/unsubscribe/user',
  [
    auth,
    [
      check('user', 'User is required to unsubscription')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    try {
      let game = await Game.findById(req.params.id);

      if (!game)
        res
          .status(404)
          .json({ errors: [{ msg: 'Game not found', type: 'database' }] });

      if (!game.status)
        res.status(400).json({
          errors: [
            {
              msg: 'The game is deactivated from the database',
              type: 'database'
            }
          ]
        });
      let isUserAdmin = await User.findOne({ role: 2, _id: req.user.id });
      if (game.gmId != req.user.id && !Boolean(isUserAdmin)) {
        return res.status(404).json({
          errors: [
            {
              msg:
                'You are not authorized to unsubscribe this user to this game',
              type: 'database'
            }
          ]
        });
      }
      if (!req.body.user) {
        return res.status(401).json({
          errors: [{ msg: 'User is required to unsubscription', type: 'user' }]
        });
      }
      const newPlayers = game.players.filter(
        playerId => playerId._id != req.body.user
      );

      game = await Game.findByIdAndUpdate(
        req.params.id,
        { $set: { players: newPlayers } },
        { new: true }
      );

      res.json(game);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ errors: [{ msg: 'Server Error', type: 'server' }] });
    }
  }
);

// @route   DELETE api/games/:id
// @desc    Delete game
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let game = await Game.findById(req.params.id);

    if (!game)
      res
        .status(404)
        .json({ errors: [{ msg: 'Game not found', type: 'database' }] });

    if (!game.status)
      res.status(400).json({
        errors: [
          {
            msg: 'The game is already deactivated from the database',
            type: 'database'
          }
        ]
      });

    // Check if requesting user has permision to the database content
    if (game.gmId.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ errors: [{ msg: 'Not authorized', type: 'authorization' }] });
    }

    await Game.findByIdAndUpdate(
      req.params.id,
      { $set: { status: false } },
      { new: true }
    );
    // await Game.findByIdAndRemove(req.params.id);

    res.json({ reports: [{ msg: 'Game deleted', type: 'crud' }] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server Error', type: 'server' }] });
  }
});

module.exports = router;
