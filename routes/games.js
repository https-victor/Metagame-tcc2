const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Game = require('../models/Game');
const Token = require('../models/Token');
const Chat = require('../models/Chat');
const mongoose = require('mongoose');


// @route   GET api/games/:filter?
// @desc    Retorna todos os jogos do usuário baseado no parâmetro de filtro
// @access  Private
router.get('/:id?', auth, async (req, res) => {
  try {
    if (req.params.id) {
      let game = await Game.findById(req.params.id);

          // Check game status
      checkGame(game, res);

      const { players, gmId, ...restGame } = game;

      const newPlayers = [...players.filter(p=>String(p)!=String(gmId))];
      const fullPlayers = await User.find({
        _id: { $in: newPlayers },
        status: true
      }).select('_id name img');
      const gm = await User.findOne({
        _id: gmId,
        status: true
      }).select('_id name img');
      const tokens = await Token.find({
        gameId: game._id,
        status: true
      });
      const chatLog = await Chat.findOne({gameId: game._id});
      res.json({
        ...restGame._doc,
        gm,
        players: fullPlayers,
        tokens,
        chatLog
      });
    } else if (req.query.filter) {
      switch (req.query.filter) {
        case 'my': {
          const myGames = await Game.find({
            gmId: req.user.id,
            status: true
          }).sort({
            createdAt: -1
          });
          res.json([...myGames]);
          break;
        }
        case 'subscribed': {
          const { games } = await User.findById(req.user.id, 'games');
          const otherGames = await Game.find({
            _id: { $in: games },
            status: true
          });
          res.json([...otherGames]);
          break;
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
          break;
        }
        default: {
          throw new Error('Filter query invalid');
        }
      }
    } else {
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
      const { _id } = await User.findById(req.user.id).select('_id');
      const newGame = new Game({
        name,
        description,
        gmId: req.user.id,
        players: [_id]
      });
      const game = await newGame.save();
      const newChat = new Chat({
        gameId: game._id
      })
      await newChat.save();

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

    // Check game status
    checkGame(game, res);

    // Check user permission
    checkUserPermisison( game.gmId, req.user.id,res );

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

// @route   POST api/games/subscribe/:id
// @desc    Subscribe to a game
// @access  Private
router.post('/subscribe/:id', auth, async (req, res) => {
  try {
    let game = await Game.findById(req.params.id);

    // Check game status
    checkGame(game, res);

    if (!(game.players.filter(player => player._id == req.user.id) == false)) {
      return res.status(404).json({
        errors: [
          { msg: 'You are already subscribed to this game', type: 'database' }
        ]
      });
    }
    const { _id } = await User.findById(req.user.id).select('_id');
    const newGames = [{ _id: game._id }, ...(req.user.games || [])];
    const newPlayers = [_id , ...game.players];

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

// @route   POST api/games/unsubscribe/:id
// @desc    Unsubscribe to a game
// @access  Private
router.post('/unsubscribe/:id', auth, async (req, res) => {
  try {
    let game = await Game.findById(req.params.id);

    // Check game status
    checkGame(game, res);

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
    const newPlayers = game.players.filter(
      playerId => playerId._id != req.user.id
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

    //Check user permission
    checkUserPermisison(game.gmId,req.user.id,res);

    await Game.findByIdAndUpdate(
      req.params.id,
      { $set: { status: false } },
      { new: true }
    );

    res.json({ reports: [{ msg: 'Game deleted', type: 'crud' }] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server Error', type: 'server' }] });
  }
});

function checkGame(game, res) {
  if (!game)
      return res
        .status(404)
        .json({ errors: [{ msg: 'Game not found', type: 'database' }] });

  if (!game.status)
  return res.status(400).json({
    errors: [
      {
        msg: 'The game is deactivated from the database',
        type: 'database'
      }
    ]
  });
}

function checkUserPermisison(gmId, userId, res){
  if (gmId.toString() !== userId) {
    return res
      .status(500)
      .json({ errors: [{ msg: 'Not authorized', type: 'authorization' }] });
  }
}

module.exports = router;
