const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Game = require('../models/Game');

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
        if(req.params.filter){
          try {
            let game = await Game.findById(req.params.filter);
            console.log(game)
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
            res.json(game);
          } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: 'Server Error', type: 'server' }] });
          }
        }
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
      const newGame = new Game({
        name,
        description,
        gmId: req.user.id,
        players: [{ _id: req.user.id }]
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
  const { name, description } = req.body;

  const gameFields = {};
  if (name) gameFields.name = name;
  if (description) gameFields.description = description;
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
    if (!(game.players.filter(playerId => playerId == req.user.id) == false)) {
      return res.status(404).json({
        errors: [
          { msg: 'You are already subscribed to this game', type: 'database' }
        ]
      });
    }
    const newPlayers = [{ _id: req.user.id }, ...game.players];
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
    if (game.players.filter(playerId => playerId == req.user.id) == false) {
      return res.status(404).json({
        errors: [
          {
            msg: 'You are already not subscribed to this game',
            type: 'database'
          }
        ]
      });
    }
    const newPlayers = game.players.filter(playerId => playerId != req.user.id);

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
        return res
          .status(401)
          .json({
            errors: [
              { msg: 'User is required to unsubscription', type: 'user' }
            ]
          });
      }
      const newPlayers = game.players.filter(
        playerId => playerId != req.body.user
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
